const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const getLastNumber = str => BigInt(str.substring(str.lastIndexOf(' ') + 1))

const idDivisible = (dividend, divisor) => (dividend % divisor) === 0n;

const monkeys = input.split(/\n\n/).map(monkeyStr => {
  const lines = monkeyStr.split(/\n/)
  const opStr = lines[2].substring(23)
  const op = old => {
    const operator = opStr[0]
    const secondValueStr = opStr.substring(opStr.lastIndexOf(' ') + 1)
    const secondValue = secondValueStr === 'old' ? old : BigInt(secondValueStr)
    return operator === '+' ? old + secondValue : old * secondValue
  }
  return {
    items: lines[1].substring(18).split(', ').map(BigInt),
    op,
    getMonkeyToThrowTo: item => {
      const divideBy = getLastNumber(lines[3])
      const ifTrue = getLastNumber(lines[4])
      const ifFalse = getLastNumber(lines[5])
      return idDivisible(item, divideBy) ? ifTrue : ifFalse
    }
  }
})

const inspections = []
for(let i=0; i < monkeys.length; i++) {
  inspections[i] = 0  
}

for(let round=0; round < 10000; round++) {
  for(let i=0; i < monkeys.length; i++) {
    const monkey = monkeys[i]
    while(monkey.items.length) {
      const item = monkey.items.shift()
      inspections[i]++
      const newWorryLevel = monkey.op(item)
      // const newWorryLevel = monkey.op(item) / 3n
      const monkeyToThrowTo = monkey.getMonkeyToThrowTo(newWorryLevel);
      monkeys[monkeyToThrowTo].items.push(newWorryLevel)
    }
  }
  if (round % 100 === 0) 
  console.log('round ' + round)
  // console.log(monkeys.map(m => m.items))
}

console.log(monkeys)
console.log(inspections)
inspections.sort((a, b) => (a < b) ? 1 : ((a > b) ? -1 : 0))
console.log(inspections)
console.log(inspections[0] * inspections[1])
