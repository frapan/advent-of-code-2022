const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const originalNumbers = input.split(/\n/).map(n => ({ n: Number(n) }))
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

for (const number of originalNumbers) {
  move(number, numbers)
}

const zeroIdx = numbers.indexOf(zero)
console.log(numbers[(zeroIdx + 1000) % numbers.length].n + numbers[(zeroIdx + 2000) % numbers.length].n + numbers[(zeroIdx + 3000) % numbers.length].n)

/*
const generate = arr => arr.map(n => ({n}))
const flat = numbs => numbs.map(numb => numb.n).join(', ')

let testNumbers = generate([0, 1, 2, 3, 4, 5])
let expected = [0, 1, 3, 4, 2, 5].join(', ')
move(testNumbers[2], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, 1, 2, 3, 4])
expected = [2, 0, 1, 3, 4].join(', ')
move(testNumbers[2], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, 1, 2, 3, 4])
expected = [0, 1, 3, 2, 4].join(', ')
move(testNumbers[3], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, 1, 2, 3, 4])
expected = [0, 1, 2, 3, 4].join(', ')
move(testNumbers[0], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, 1, 13, 3, 4])
expected = [0, 1, 3, 13, 4].join(', ')
move(testNumbers[2], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, -1, 2, 3, 4])
expected = [-1, 0, 2, 3, 4].join(', ')
move(testNumbers[1], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, -2, 2, 3, 4])
expected = [0, 2, 3, -2, 4].join(', ')
move(testNumbers[1], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, -7, 2, 3, 4])
expected = [0, 2, -7, 3, 4].join(', ')
move(testNumbers[1], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, 1, -11, 3, 4])
expected = [0, -11, 1, 3, 4].join(', ')
move(testNumbers[1], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)

testNumbers = generate([0, -10, 2, 3, 4])
expected = [0, 2, 3, -10, 4].join(', ')
move(testNumbers[1], testNumbers)
console.log(flat(testNumbers), flat(testNumbers) === expected)
*/