const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')
const gas = input.split('')
let gasLength = gas.length
let gasIndex = 0

const COLUMNS = 7
const floor = [[1, 1, 1, 1, 1, 1, 1]]

const shapes = [
  [[1, 1, 1, 1]],
  [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
  [[1], [1], [1], [1]],
  [[1, 1], [1, 1]]
]

const MAX_ROCK_COUNT = 1000000000000

const detectCollisionWithFloor = (rock) => {
  if (rock.bottomYCoord > floor.length) {
    return false
  }
  for (let y = 0; y < rock.shape.length; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (floor[rock.bottomYCoord + y - 1] && floor[rock.bottomYCoord + y - 1][x] && rock.shape[y][x - rock.xCoord]) {
        return true
      }
    }
  }
  return false
}

function moveHorizontally(rock) {
  const dir = gas[gasIndex]
  gasIndex++
  if (gasIndex === gasLength) {
    gasIndex = 0
  }
  if (dir === '>') {
    if (rock.shape[0].length + rock.xCoord === COLUMNS) {
      return
    }
    if (rock.bottomYCoord > floor.length) {
      rock.xCoord++
      return
    }
    for (let y = 0; y < rock.shape.length; y++) {
      for (let x = rock.shape[0].length - 1; x >= 0; x--) {
        if (rock.shape[y][x]) {
          if (floor[rock.bottomYCoord + y] && floor[rock.bottomYCoord + y][x + rock.xCoord + 1]) {
            return
          }
          break
        }
      }
    }
    rock.xCoord++
  } else {
    if (rock.xCoord === 0) {
      return
    }
    if (rock.bottomYCoord > floor.length) {
      rock.xCoord--
      return
    }
    for (let y = 0; y < rock.shape.length; y++) {
      for (let x = 0; x < rock.shape[0].length; x++) {
        if (rock.shape[y][x]) {
          if (floor[rock.bottomYCoord + y] && floor[rock.bottomYCoord + y][x + rock.xCoord - 1]) {
            return
          }
          break
        }
      }
    }
    rock.xCoord--
  }
}

for (let rockCount = 0; rockCount < MAX_ROCK_COUNT; rockCount++) {
  const rock = {
    bottomYCoord: floor.length + 3,
    xCoord: 2,
    shape: shapes[rockCount % shapes.length]
  }
  let collide = false
  while (!collide) {
    moveHorizontally(rock)
    collide = detectCollisionWithFloor(rock)
    if (collide) {
      for (let y = 0; y < rock.shape.length; y++) {
        let level = floor[rock.bottomYCoord + y]
        if (!level) {
          level = [0, 0, 0, 0, 0, 0, 0]
          floor[rock.bottomYCoord + y] = level
        }
        for (let x = 0; x < COLUMNS; x++) {
          if (rock.shape[y][x - rock.xCoord]) {
            level[x] = 1
          }
        }
      }
    } else {
      rock.bottomYCoord--
    }
  }
}

console.log(floor.length - 1)