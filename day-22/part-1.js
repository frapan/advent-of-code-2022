const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const parseInput = input => {
  const [boardStr, path] = input.split(/\n\n/)
  const board = boardStr.split(/\n/).map(row => row.split(''))
  const rowBordersAtColumn = board.map(row => ({
    low: row.findIndex(c => c !== ' '),
    high: row.length - 1
  }))
  const columnBordersAtRow = []
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== ' ' && y < (columnBordersAtRow[x]?.low ?? Infinity)) {
        columnBordersAtRow[x] = columnBordersAtRow[x] || {}
        columnBordersAtRow[x].low = y
      }
      if (board[y][x] !== ' ' && y > (columnBordersAtRow[x]?.high ?? -1)) {
        columnBordersAtRow[x].high = y
      }
    }
  }
  return { board, path, rowBordersAtColumn, columnBordersAtRow }  
}

const { board, path, rowBordersAtColumn, columnBordersAtRow } = parseInput(input)

const move = (position, board, path, rowBordersAtColumn, columnBordersAtRow) => {
  while (path) {
    let distance = parseInt(path, 10)
    path = path.substring(String(distance).length)
    while (distance > 0) {
      if (position.facing === 0) {
        let nextX = position.x + 1
        if (nextX > rowBordersAtColumn[position.y].high) {
          nextX = rowBordersAtColumn[position.y].low
        }
        const nextTile = board[position.y][nextX]
        if (nextTile === '.') {
          position.x = nextX
        } else if (nextTile === '#') {
          break
        }
      } else if (position.facing === 1) {
        let nextY = position.y + 1
        if (nextY > columnBordersAtRow[position.x].high) {
          nextY = columnBordersAtRow[position.x].low
        }
        const nextTile = board[nextY][position.x]
        if (nextTile === '.') {
          position.y = nextY
        } else if (nextTile === '#') {
          break
        }
      } else if (position.facing === 2) {
        let nextX = position.x - 1
        if (nextX < rowBordersAtColumn[position.y].low) {
          nextX = rowBordersAtColumn[position.y].high
        }
        const nextTile = board[position.y][nextX]
        if (nextTile === '.') {
          position.x = nextX
        } else if (nextTile === '#') {
          break
        }
      } else if (position.facing === 3) {
        let nextY = position.y - 1
        if (nextY < columnBordersAtRow[position.x].low) {
          nextY = columnBordersAtRow[position.x].high
        }
        const nextTile = board[nextY][position.x]
        if (nextTile === '.') {
          position.y = nextY
        } else if (nextTile === '#') {
          break
        }
      }
      distance --
    }
    
    if (path.length) {
      const dir = path[0]
      if (dir === 'R') {
        position.facing = (position.facing + 1) % 4
      } else {
        position.facing = (position.facing - 1 + 4) % 4
      }
      path = path.substring(1)
    }
  }
}

const position = {
  y: 0,
  x: rowBordersAtColumn[0].low,
  facing: 0
}

move(position, board, path, rowBordersAtColumn, columnBordersAtRow)

console.log(position)
console.log((position.y + 1) * 1000 + (position.x + 1) * 4 + position.facing)

// const printBoard = (board) => {
//   board.forEach(row => console.log(row.join('')))
// }
//
// printBoard(board)
// console.log(path)
// console.log(rowBordersAtColumn, columnBordersAtRow)