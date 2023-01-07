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
// printBoard(initialBlizzards, initialPosition, board, 0)


const initialPosition = { x: 1, y: 0 }
const finalPosition = { x: board.maxX, y: board.maxY + 1 }

const playerMoves = [
  { incX: 0, incY: 0 },
  { incX: -1, incY: 0}, 
  { incX: 0, incY: -1}, 
  { incX: 0, incY: 1}, 
  { incX: 1, incY: 0}, 
]

const reversePlayerMoves = [
  { incX: 0, incY: 0 },
  { incX: 1, incY: 0}, 
  { incX: 0, incY: 1}, 
  { incX: 0, incY: -1}, 
  { incX: -1, incY: 0}, 
]

const move = (initialPosition, initialBlizzards, initialMinute, finalPosition, orderedPlayerMoves) => {
  
  let bestMinutes = 2000
  let bestBlizzards = null

  const visited = new Set()

  const firstMove = {
    position: initialPosition,
    blizzards: initialBlizzards,
    minute: initialMinute
  }
  const availableMoves = [firstMove]
  
  while (availableMoves.length) {
    const { position, blizzards, minute } = availableMoves.shift()
    if (minute >= bestMinutes) {
      continue
    }
  
    if (position.y === finalPosition.y && position.x === finalPosition.x) {
      bestMinutes = Math.min(bestMinutes, minute)
      bestBlizzards = blizzards
      console.log(`trovata soluzione in ${minute} minuti: ${new Date()}`)
      continue
    }
    
    const positionAtMinute = position.x + '-' + position.y + '-' + minute
    if (visited.has(positionAtMinute)) {
      continue
    } else {
      visited.add(positionAtMinute)
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
  
    for (const playerMove of orderedPlayerMoves) {
      const newPosition = { x: position.x + playerMove.incX, y: position.y + playerMove.incY }
      if (newPosition.y < board.minY || newPosition.y > board.maxY || newPosition.x < board.minX || newPosition.x > board.maxX) {
        if (!(newPosition.y === 0 && newPosition.x === 1) && !(newPosition.y === board.maxY + 1 && newPosition.x === board.maxX)) {
          continue
        }
      }
      if (newBlizzards.every(b => b.x !== newPosition.x || b.y !== newPosition.y)) {
        availableMoves.unshift({
          position: { x: newPosition.x, y: newPosition.y }, 
          blizzards: newBlizzards, 
          minute: minute + 1,
        })
      }
    }
  }
  
  return { blizzards: bestBlizzards, minute: bestMinutes }
}

console.log('start: ' + new Date())
const result1 = move(initialPosition, initialBlizzards, 0, finalPosition, playerMoves)
console.log(result1.minute)
const result2 = move(finalPosition, result1.blizzards, result1.minute, initialPosition, reversePlayerMoves)
console.log(result2.minute)
const result3 = move(initialPosition, result2.blizzards, result2.minute, finalPosition, playerMoves)
console.log(result3.minute)
console.log('end: ' + new Date())
