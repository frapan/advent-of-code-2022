const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const parseInput = (input) => {
  const lines = input.split(/\n/)

  const initialBlizzards = lines.reduce((acc, line, y) => 
    acc.concat(line.split('')
      .map((c, x) => {
        if (c === '<') {
          return { x, y, incX: -1, incY: 0 , c}
        }
        if (c === '>') {
          return { x, y, incX: 1, incY: 0 , c}
        }
        if (c === 'v') {
          return { x, y, incX: 0, incY: 1 , c}
        }
        if (c === '^') {
          return { x, y, incX: 0, incY: -1, c }
        }
        return null
      })
      .filter(obj => obj)
    ), [])
  return { 
    initialBlizzards,
    board: {
      minX: 1,
      minY: 1,
      maxX: lines[0].length - 2,
      maxY: lines.length - 2,
    }
  }
}

const { initialBlizzards, board } = parseInput(input)
// console.log(initialBlizzards)
// console.log(board)

const printBoard = (blizzards, position, board, minute) => {
  const area = []
  for (let y = 0; y <= board.maxY; y++) {
    area[y] = '.'.repeat(board.maxX + 1).split('')
  }
  for (const blizzard of blizzards) {
    area[blizzard.y][blizzard.x] = blizzard.c
  }
  area[position.y][position.x] = 'E'
  console.log('')
  console.log('@minute ' + minute)
  for (let y = 1; y <= board.maxY; y++) {
    console.log(area[y].slice(1).join(''))
  }
}


const initialPosition = { x: 1, y: 0 }
// printBoard(initialBlizzards, initialPosition, board, 0)

const playerMoves = [{ incX: 1, incY: 0}, { incX: 0, incY: 1}, { incX: 0, incY: -1}, { incX: -1, incY: 0}, { incX: 0, incY: 0 }]

let bestMinutes = 686 // from a previous run with Infinity

const move = (position, blizzards, minute) => {
  if (minute >= bestMinutes ||
      (board.maxX - position.x) + (board.maxY - position.y) + minute >= bestMinutes) {
    return Infinity
  }

  if (position.y === board.maxY && position.x === board.maxX) {
    bestMinutes = Math.min(bestMinutes, minute)
    console.log(`trovata soluzione in ${minute} minuti: ${new Date()}`)
    // for (const h of history) {
    //   printBoard(h.blizzards, h.position, board, h.minute)
    // }
    return minute
  }
  
  const newBlizzards = []
  for (const blizzard of blizzards) {
    const newBlizzard = { ...blizzard }
    newBlizzard.x += newBlizzard.incX
    newBlizzard.y += newBlizzard.incY
    if (newBlizzard.x < board.minX) newBlizzard.x = board.maxX
    if (newBlizzard.x > board.maxX) newBlizzard.x = board.minX
    if (newBlizzard.y < board.minY) newBlizzard.y = board.maxY
    if (newBlizzard.y > board.maxY) newBlizzard.y = board.minY
    newBlizzards.push(newBlizzard)
  }

  let moveMinutes = Infinity
  for (const playerMove of playerMoves) {
    const newPosition = { x: position.x + playerMove.incX, y: position.y + playerMove.incY }
    if (newPosition.y < board.minY || newPosition.y > board.maxY || newPosition.x < board.minX || newPosition.x > board.maxX) {
      if (!(newPosition.y === 0 && newPosition.x === 1)) {
        continue
      }
    }
    if (newBlizzards.every(b => b.x !== newPosition.x || b.y !== newPosition.y)) {
      const result = move({ x: newPosition.x, y: newPosition.y }, newBlizzards, minute + 1)
      if (result < moveMinutes) {
        moveMinutes = result
      }
    }
  }
  return moveMinutes
}

const result = move(initialPosition, initialBlizzards, 1)
console.log(bestMinutes, result)

// 712 too high
// 707 too high
// 697 too high
// 685 wrong
// 669 wrong