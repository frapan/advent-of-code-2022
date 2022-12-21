const { readFileSync } = require('fs')
const { resolve } = require('path')

// const MAX_ROCK_COUNT = 1000000000000
const MAX_ROCK_COUNT = 2022
const KEEP_FLOOR_ROWS = 10000

const input = readFileSync(resolve(__dirname, './input.txt'), 'utf-8')
const gas = input.split('')
let gasLength = gas.length
let gasIndex = 0

const toBinary = (arr) => arr.reverse().reduce((acc, val, i) => acc + val * 2 ** (i * 7), 0)

const COLUMNS = 7
let floor = [0b1111111]
let floorCuts = 0

// let history = []

const shapes = [
  [0b0011110],
  [0b0001000, 0b0011100, 0b0001000],
  [0b0000100, 0b0000100, 0b0011100],
  [0b0010000, 0b0010000, 0b0010000, 0b0010000],
  [0b0011000, 0b0011000],
].map(shape => ({
  multiLine: shape,
  singleLine: toBinary(shape)
}))

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
  return shape.multiLine.some((row, i) => (row & floor[shapeBottomYCoord + i]) > 0)
  // const floorBits = toBinary([floor[shapeBottomYCoord + 3] || 0, floor[shapeBottomYCoord + 2] || 0, floor[shapeBottomYCoord + 1] || 0, floor[shapeBottomYCoord]])
  // return (shape.singleLine & floorBits) > 0
}

function moveHorizontally(rock, detectCollision) {
  const dir = gas[gasIndex++]
  if (gasIndex === gasLength) {
    gasIndex = 0
  }
  let newShape
  if (dir === '>') {
    // if (rock.shape.multiLine.some(row => (row % 2) === 1)) {
    if ((rock.shape.singleLine & moveRightCheck) > 0) {
      return
    }
    newShape = {
      multiLine: rock.shape.multiLine.map(row => row / 2)
    }
  } else {
    // if (rock.shape.multiLine.some(row => row >= 64)) {
    if ((rock.shape.singleLine & moveLeftCheck) > 0) {
      return
    }
    newShape = {
      multiLine: rock.shape.multiLine.map(row => row * 2),
    }
  }
  if (!detectCollision || !detectCollisionWithFloor(newShape, rock.bottomYCoord)) {
    newShape.singleLine = toBinary(newShape.multiLine)
    rock.shape = newShape
  }
}

for (let rockCount = 0; rockCount < MAX_ROCK_COUNT; rockCount++) {
  if (rockCount % 100000000 === 0) {
    console.log(new Date(), rockCount, floorCuts)
  }
  const rock = {
    bottomYCoord: floor.length + 3,
    shape: shapes[rockCount % shapes.length]
  }
  // history.push({ rockCount, shapeIndex: rockCount % shapes.length, gasIndex})
  moveHorizontally(rock, false)
  moveHorizontally(rock, false)
  rock.bottomYCoord -= 2
  let collide = false
  while (!collide) {
    moveHorizontally(rock, true)
    let newBottomYCoord = rock.bottomYCoord - 1
    collide = detectCollisionWithFloor(rock.shape, newBottomYCoord)
    if (collide) {
      for (let y = 0; y < rock.shape.multiLine.length; y++) {
        floor[rock.bottomYCoord + y] = floor[rock.bottomYCoord + y] | rock.shape.multiLine[y]
      }
      // if (floor[floor.length - 1] > 16 + 32 + 64 && gasIndex === 0) { // Per il mio input 
      if (floor[floor.length - 1] > 1 + 32 + 64 && gasIndex === 0) { // Per l'input di test
        console.log(new Date(), rockCount, floorCuts, floor.length, floorCuts * KEEP_FLOOR_ROWS + floor.length - 1, '**********', gasIndex, floor[floor.length - 1])
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
// printFloor()