const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const originalNumbers = input.split(/\n/).map(n => ({ n: Number(n) * 811589153 }))
const numbers = [...originalNumbers]
const zero = numbers.find(number => number.n === 0)

function move(number, allNumbers) {
  const n = number.n
  if (n === 0) {
    return;
  }
  const idx = allNumbers.indexOf(number)
  allNumbers.splice(idx, 1)
  let newIdx = (idx + n + allNumbers.length) % allNumbers.length
  allNumbers.splice(newIdx, 0, number)
}

for (let i = 0; i < 10; i++) {
  for (const number of originalNumbers) {
    move(number, numbers)
  }
}

const zeroIdx = numbers.indexOf(zero)
console.log(numbers[(zeroIdx + 1000) % numbers.length].n + numbers[(zeroIdx + 2000) % numbers.length].n + numbers[(zeroIdx + 3000) % numbers.length].n)
