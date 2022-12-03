const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const elves = input.split(/\r?\n\r?\n/)

const elvesScores = elves.map(elf => elf.split(/\r?\n/).reduce((acc, score) => acc + Number(score), 0))

elvesScores.sort((a, b) => b - a)

console.log(elvesScores[0] + elvesScores[1] + elvesScores[2])

