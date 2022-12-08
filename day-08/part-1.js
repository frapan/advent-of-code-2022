const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)
const visibleTreesCoords = new Set()
const columnLength = lines.length
const rowLength = lines[0].length

const addCoordsToSet = (x, y, transposed) => {
  if (transposed) {
    visibleTreesCoords.add(String(y) + '-' + String(x))
  } else {
    visibleTreesCoords.add(String(x) + '-' + String(y))
  }
}
  
const findVisibleTreesInLine = (line, y, transposed) => {
  const highestTreeSize = String(Math.max(...line))
  const lowestIndex = line.indexOf(highestTreeSize)
  addCoordsToSet(String(lowestIndex), String(y), transposed)
  let lastSize = line[0]
  addCoordsToSet(String(0), String(y), transposed)
  for (let x = 1; x < lowestIndex; x++) {
    if (line[x] > lastSize) {
      lastSize = line[x]
      addCoordsToSet(String(x), String(y), transposed)
    }
  }

  const highestIndex = line.indexOf(highestTreeSize)
  addCoordsToSet(String(highestIndex), String(y), transposed)
  lastSize = line[rowLength - 1]
  addCoordsToSet(String(rowLength - 1), String(y), transposed)
  for (let x = rowLength - 2; x > 0; x--) {
    if (line[x] > lastSize) {
      lastSize = line[x]
      addCoordsToSet(String(x), String(y), transposed)
    }
  }
}

const transpose = lines => {
  const res = []
  for (let x = 0; x < rowLength; x++) {
    res[x] = []
  }
  for (let y = 0; y < columnLength; y++) {
    for (let x = 0; x < rowLength; x++) {
      res[x][y] = lines[y][x]
    }
  } 
  return res
}

for (let y = 0; y < columnLength; y++) {
  const line = lines[y]
  findVisibleTreesInLine(line, y, false);
}

const transposedLines = transpose(lines)
for (let y = 0; y < transposedLines.length; y++) {
  const line = transposedLines[y]
  findVisibleTreesInLine(line, y, true);
}

console.log(visibleTreesCoords.size)


