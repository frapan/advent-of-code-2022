const { readFileSync } = require('fs')
const { resolve } = require('path')

const MAX_ROCK_COUNT = 1000000000000
// const MAX_ROCK_COUNT = 2022
const KEEP_FLOOR_ROWS = 10000

const input = readFileSync(resolve(__dirname, './input.txt'), 'utf-8')
const gas = input.split('')
let gasLength = gas.length
let gasIndex = 0

const toBinary = (arr) => arr.reverse().reduce((acc, val, i) => acc + val * 2 ** (i * 7), 0)

const COLUMNS = 7
let floor = [0b1111111]
let floorCuts = 0

const exp7 = 2 ** 7
const exp14 = 2 ** 14
const exp21 = 2 ** 21
const exp28 = 2 ** 28

const shapes = [
  [0b0011110],
  [toBinary([0b0001000, 0b0011100, 0b0001000])],
  [toBinary([0b0000100, 0b0000100, 0b0011100])],
  [toBinary([0b0010000, 0b0010000, 0b0010000, 0b0010000])],
  [toBinary([0b0011000, 0b0011000])],
]

const moveRightCheck = toBinary([1, 1, 1, 1])
const moveLeftCheck = toBinary([0b1000000, 0b1000000, 0b1000000, 0b1000000])

const printFloor = () => {
  for (let i = floor.length - 1; i >= 0 ; i--) {
    console.log(floor[i].toString(2).padStart(7, '0'))
  }
}

const detectCollisionWithFloor = (shape, shapeBottomYCoord) => {
  if (shapeBottomYCoord > floor.length) {
    return false
  }
  const floorBits = toBinary([floor[shapeBottomYCoord + 3] || 0, floor[shapeBottomYCoord + 2] || 0, floor[shapeBottomYCoord + 1] || 0, floor[shapeBottomYCoord]])
  return (shape & floorBits) > 0
}

function moveHorizontally(rock) {
  const dir = gas[gasIndex]
  gasIndex++
  if (gasIndex === gasLength) {
    gasIndex = 0
  }
  let newShape
  if (dir === '>') {
    if ((rock.shape & moveRightCheck) > 0) {
      return
    }
    // newShape = rock.shape.map(row => row / 2)
    const shapeStr = Number(rock.shape).toString(2).padStart(28, '0')
    newShape = toBinary([Number('0b' + shapeStr.substring(0, 7)) / 2, Number('0b' + shapeStr.substring(7, 14)) / 2, Number('0b' + shapeStr.substring(14, 21)) / 2, Number('0b' + shapeStr.substring(21, 28)) / 2])
  } else {
    if ((rock.shape & moveLeftCheck) > 0) {
      return
    }
    // newShape = rock.shape.map(row => row * 2)
    const shapeStr = Number(rock.shape).toString(2).padStart(28, '0')
    newShape = toBinary([Number('0b' + shapeStr.substring(0, 7)) * 2, Number('0b' + shapeStr.substring(7, 14)) * 2, Number('0b' + shapeStr.substring(14, 21)) * 2, Number('0b' + shapeStr.substring(21, 28)) * 2])
  }
  if (!detectCollisionWithFloor(newShape, rock.bottomYCoord)) {
    rock.shape = newShape
  }
}

for (let rockCount = 0; rockCount < MAX_ROCK_COUNT; rockCount++) {
  if (rockCount % 1000 === 0) {
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
      let tmp = rock.shape
      let y = 0
      while (tmp > 0) {
        floor[rock.bottomYCoord + y] = floor[rock.bottomYCoord + y++] | tmp % exp7
        tmp = Math.floor(tmp / exp7)
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