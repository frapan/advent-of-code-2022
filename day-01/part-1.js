const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const elves = input.split(/\r?\n\r?\n/)

const elvesScores = elves.map(elf => elf.split(/\r?\n/).reduce((acc, score) => acc + Number(score), 0))

const highestScore = Math.max(...elvesScores)

console.log(highestScore)

