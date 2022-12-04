const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const pairs = input.split(/\r?\n/)

const fullyContains = ([a, b]) => {
  const [aFrom, aTo] = a.split('-').map(Number)
  const [bFrom, bTo] = b.split('-').map(Number)
  return aFrom >= bFrom && aTo <=bTo || bFrom >= aFrom && bTo <=aTo ? 1 : 0
}

const fullyContainedCount = pairs.reduce((acc, pair) => acc + fullyContains(pair.split(',')), 0)

console.log(fullyContainedCount)
