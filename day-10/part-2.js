const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)

const registerHistory = lines.reduce((acc, line) => {
  acc.pixels.push(Math.abs(acc.x - (acc.cycle % 40)) <= 1 ? '#' : '.')
  acc.cycle++
  
  if (line !== 'noop') {
    acc.pixels.push(Math.abs(acc.x - (acc.cycle % 40)) <= 1 ? '#' : '.')
    acc.cycle++
    acc.x += Number(line.substring(5))
  }
    
  return acc
}, ({ pixels: [], cycle: 0, x: 1 }))

console.log(registerHistory.pixels.slice(0, 40).join(''))
console.log(registerHistory.pixels.slice(40, 80).join(''))
console.log(registerHistory.pixels.slice(80, 120).join(''))
console.log(registerHistory.pixels.slice(120, 160).join(''))
console.log(registerHistory.pixels.slice(160, 200).join(''))
console.log(registerHistory.pixels.slice(200, 240).join(''))