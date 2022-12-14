const { readFileSync } = require('fs')

let DROP_WIDTH = 500

const input = readFileSync('./input.txt', 'utf-8')

const parseInput = (input) => {
  const paths = input.split(/\n/)
  let [minX, maxX, minY, maxY] = [ Infinity, 0, 0, 0 ]
  const matrix = paths.reduce((acc, path) => {
    const edges = path.split(' -> ')
    for (let i = 0; i < edges.length - 1; i++) {
      let [startX, startY] = edges[i].split(',').map(Number)
      let [endX, endY] = edges[i + 1].split(',').map(Number)
      if (startX > endX) {
        ;[startX, endX] = [endX, startX]
      }
      if (startY > endY) {
        ;[startY, endY] = [endY, startY]
      }
      minX = Math.min(minX, startX)
      maxX = Math.max(maxX, endX)
      minY = Math.min(minY, startY)
      maxY = Math.max(maxY, endY)
      if (startX === endX) {
        for (let k = startY; k <= endY; k++) {
          acc[startX] = acc[startX] || []
          acc[startX][k] = '#'
        }
      } else if (startY === endY) {
        for (let k = startX; k <= endX; k++) {
          acc[k] = acc[k] || []
          acc[k][startY] = '#'
        }
      } else {
        throw new Error('Not a straight line')
      }
    }
    return acc
  }, [])
  matrix[minX - 1] = []
  matrix[maxX + 1] = []
  return {
    matrix,
    size: { minX, maxX, minY, maxY }
  }
}

const printMatrix = (matrix, size) => {
  for (let y = size.minY; y <= size.maxY; y++) {
    let row = ''
    for (let x = size.minX; x <= size.maxX; x++) {
      row += matrix[x][y] || ' ' 
    }
    console.log(row)
  }
  // console.log({ size })
}

const enlarge = ({ matrix, size }) => {
  size.maxY += 2
  size.minX = DROP_WIDTH - size.maxY - 2
  size.maxX = DROP_WIDTH + size.maxY + 2
  for (let x = size.minX; x <= size.maxX; x++) {
    matrix[x] = matrix[x] || []
    matrix[x][size.maxY] = '#'
  }
  return { matrix, size }
} 

const { matrix, size } = enlarge(parseInput(input))

const IN_REST = 1
const OUT_OF_RANGE = -1
const END = 0

const move = (x, y) => {
  if (y === size.maxY) {
    return OUT_OF_RANGE
  }
  let xBelow
  for (xBelow of [x, x - 1, x + 1]) {
    if (!matrix[xBelow][y + 1]) {
      return move(xBelow, y + 1)
    }
  }
  matrix[x][y] = 'o'
  if (x === DROP_WIDTH && y === 0) {
    return END
  }
  return IN_REST
}

const createNewUnit = () => move(DROP_WIDTH, 0)

const start = () => {
  let units = 0
  while (createNewUnit() === IN_REST) {
    units++
    if (units % 1000000 === 0) {
      printMatrix(matrix, size)
      console.log(units)
    }
  }
  matrix[500][0] = '+'
  printMatrix(matrix, size)
  console.log(units + 1)
}

start()
// 24942