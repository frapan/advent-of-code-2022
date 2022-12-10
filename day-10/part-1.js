const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)

const registerHistory = lines.reduce((acc, line) => {
  acc.cycle++
  if (acc.cycle >= 20 && ((acc.cycle - 20) % 40 === 0)) {
    acc.strength += acc.x * acc.cycle
  }
  
  if (line !== 'noop') {
    acc.cycle++
    if (acc.cycle >= 20 && ((acc.cycle - 20) % 40 === 0)) {
      acc.strength += acc.x * acc.cycle
    }
    acc.x += Number(line.substring(5))
  }
    
  return acc
}, ({ strength: 0, cycle: 0, x: 1 }))

console.log(registerHistory)