const {readFileSync} = require('fs')

const ROUNDS = 10

const movingChecks = [
  [[-1, -1], [-1, 0], [-1, 1]],
  [[1, -1], [1, 0], [1, 1]],
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 1], [0, 1], [1, 1]],
]

const adjacentCells = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

const input = readFileSync('./input.txt', 'utf-8')

const newEmptyArray = (n) => new Array(n).fill('.')

const parseInput = input => {
  const inputRows = input.split(/\n/)
  return newEmptyArray(ROUNDS).concat(newEmptyArray(inputRows.length)).concat(newEmptyArray(ROUNDS))
    .map((row, i) => newEmptyArray(ROUNDS).concat(i < ROUNDS || i >= inputRows.length + ROUNDS ? newEmptyArray(inputRows[0].length) : inputRows[i - ROUNDS].split('')).concat(newEmptyArray(ROUNDS)))
}

const move = (field, round) => {
  const moves = {}
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === '.' || adjacentCells.every(coords => field[y + coords[0]][x + coords[1]] === '.')) {
        continue
      }
      for (let k = 0; k < 4; k++) {
        const checkIndex = (round + k) % 4
        const canMove = movingChecks[checkIndex].every(coords => field[y + coords[0]][x + coords[1]] === '.')
        if (canMove) {
          const newCoords = [y + movingChecks[checkIndex][1][0], x + movingChecks[checkIndex][1][1]].join(',')
          moves[newCoords] = moves[newCoords] || []
          moves[newCoords].push([y, x])
          break
        }
      }
    }
  }

  const goodNewCoords = Object.keys(moves).filter(key => moves[key].length === 1)
  for (const goodNewCoord of goodNewCoords) {
    const splittedNewCoords = goodNewCoord.split(',').map(Number)
    field[splittedNewCoords[0]][splittedNewCoords[1]] = '#'
    const oldCoords = moves[goodNewCoord][0]
    field[oldCoords[0]][oldCoords[1]] = '.'
  }
}

const calculateEmptyTiles = field => {
  let xFrom = Infinity
  let xTo = 0
  let yFrom = Infinity
  let yTo = 0
  let count = 0
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === '#') {
        count++
        xFrom = Math.min(xFrom, x)
        xTo = Math.max(xTo, x)
        yFrom = Math.min(yFrom, y)
        yTo = Math.max(yTo, y)
      }
    }
  }
  return (xTo - xFrom + 1) * (yTo - yFrom + 1) - count
}

const field = parseInput(input)

for (let round = 0; round < ROUNDS; round++) {
  move(field, round)
}

const emptyTiles = calculateEmptyTiles(field)
console.log(emptyTiles)

// const printField = (field) => {
//   field.forEach(row => console.log(row.join('')))
// }
// printField(field)