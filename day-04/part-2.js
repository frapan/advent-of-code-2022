const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const pairs = input.split(/\r?\n/)

const overlaps = ([a, b]) => {
  const [aFrom, aTo] = a.split('-').map(Number)
  const [bFrom, bTo] = b.split('-').map(Number)
  return aFrom <= bTo && aTo >= bFrom || bFrom <= aTo && bTo >= aFrom ? 1 : 0
}

const fullyContainedCount = pairs.reduce((acc, pair) => acc + overlaps(pair.split(',')), 0)

console.log(fullyContainedCount)
