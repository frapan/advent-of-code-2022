const { readFileSync } = require('fs')

const line = readFileSync('./input.txt', 'utf-8')

const chars = line.split('')

const noRepeatedChars = (arr) => arr.every(char => arr.filter(c => c === char).length === 1)

const MARKER_SIZE = 14

let possibleMarker = chars.slice(0, MARKER_SIZE)
let i
for (i = MARKER_SIZE; i < chars.length; i++) {
  possibleMarker.shift()
  possibleMarker.push(chars[i])
  if (noRepeatedChars(possibleMarker)) {
    console.log(i + 1)
    process.exit(1)
  }
}

console.log(`cannot find a marker after ${i} chars`)
