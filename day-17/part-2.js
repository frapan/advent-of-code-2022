const { readFileSync } = require('fs')
const { resolve } = require('path')

// const MAX_ROCK_COUNT = 1000000000000
const MAX_ROCK_COUNT = 2022
const KEEP_FLOOR_ROWS = 10000

const input = readFileSync(resolve(__dirname, './input.txt'), 'utf-8')
const gas = input.split('')
let gasLength = gas.length
let gasIndex = 0

const toBinary = (arr) => arr.reverse().reduce((acc, val, i) => acc + val * 2 ** i, 0)

const COLUMNS = 7
let floor = [toBinary([1, 1, 1, 1, 1, 1, 1])]
let floorCuts = 0

const shapes = [
  [toBinary([0, 0, 1, 1, 1, 1, 0])],
  [toBinary([0, 0, 0, 1, 0, 0, 0]), toBinary([0, 0, 1, 1, 1, 0, 0]), toBinary([0, 0, 0, 1, 0, 0, 0])],
  [toBinary([0, 0, 1, 1, 1, 0, 0]), toBinary([0, 0, 0, 0, 1, 0, 0]), toBinary([0, 0, 0, 0, 1, 0, 0])],
  [toBinary([0, 0, 1, 0, 0, 0, 0]), toBinary([0, 0, 1, 0, 0, 0, 0]), toBinary([0, 0, 1, 0, 0, 0, 0]), toBinary([0, 0, 1, 0, 0, 0, 0])],
  [toBinary([0, 0, 1, 1, 0, 0, 0]), toBinary([0, 0, 1, 1, 0, 0, 0])]
]

const printFloor = () => {
  for (let i = floor.length - 1; i >= 0 ; i--) {
    console.log(floor[i].toString(2).padStart(7, '0'))
  }
}

const detectCollisionWithFloor = (shape, shapeBottomYCoord) => {
  if (shapeBottomYCoord > floor.length) {
    return false
  }
  return shape.some((row, i) => (row & floor[shapeBottomYCoord + i]) > 0)
}

function moveHorizontally(rock) {
  const dir = gas[gasIndex]
  gasIndex++
  if (gasIndex === gasLength) {
    gasIndex = 0
  }
  let newShape
  if (dir === '>') {
    if (rock.shape.some(row => (row % 2) === 1)) {
      return
    }
    newShape = rock.shape.map(row => row / 2)
  } else {
    if (rock.shape.some(row => row >= 64)) {
      return
    }
    newShape = rock.shape.map(row => row * 2)
  }
  if (!detectCollisionWithFloor(newShape, rock.bottomYCoord)) {
    rock.shape = newShape
  }
}

for (let rockCount = 0; rockCount < MAX_ROCK_COUNT; rockCount++) {
  if (rockCount % 1000000 === 0) {
    console.log(rockCount, floorCuts)
  }
  const rock = {
    bottomYCoord: floor.length + 3,
    shape: shapes[rockCount % shapes.length]
  }
  let collide = false
  while (!collide) {
    moveHorizontally(rock)
    let newBottomYCoord = rock.bottomYCoord - 1
    collide = detectCollisionWithFloor(rock.shape, newBottomYCoord)
    if (collide) {
      for (let y = 0; y < rock.shape.length; y++) {
        floor[rock.bottomYCoord + y] = floor[rock.bottomYCoord + y] | rock.shape[y]
      }
      if (floor.length > KEEP_FLOOR_ROWS * 2) {
        floor = floor.slice(KEEP_FLOOR_ROWS)
        floorCuts++
        floor[0] = [1, 1, 1, 1, 1, 1, 1]
      }
    } else {
      rock.bottomYCoord = newBottomYCoord
    }
  }
}

console.log(floorCuts * KEEP_FLOOR_ROWS + floor.length - 1, floorCuts)