const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)
const columnLength = lines.length
const rowLength = lines[0].length
let maxScenicScore = 0

const getScenicScore = (treeX, treeY, treeSize) => {
  let x, y
  for (x = treeX - 1; x >= 0 && lines[treeY][x] < treeSize; x--) {}
  const scoreLeft = treeX - (x < 0 ? 0 : x)
  for (x = treeX + 1; x < rowLength && lines[treeY][x] < treeSize; x++) {}
  const scoreRight = (x === rowLength ? x - 1 : x) - treeX
  for (y = treeY - 1; y >= 0 && lines[y][treeX] < treeSize; y--) {}
  const scoreUp = treeY - (y < 0 ? 0 : y)
  for (y = treeY + 1; y < columnLength && lines[y][treeX] < treeSize; y++) {}
  const scoreDown = (y === columnLength ? y - 1 : y) - treeY
  return scoreLeft * scoreRight * scoreUp * scoreDown
}

for (let y = 1; y < columnLength - 1; y++) {
  for (let x = 1; x < rowLength - 1; x++) {
    const scenicScore = getScenicScore(x, y, lines[y][x])
    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore
    }
  }
} 

console.log(maxScenicScore)


