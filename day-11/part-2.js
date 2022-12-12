const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const getLastNumber = str => Number(str.substring(str.lastIndexOf(' ') + 1))

const idDivisible = (dividend, divisor) => (dividend % divisor) === 0;

const monkeys = input.split(/\n\n/).map(monkeyStr => {
  const lines = monkeyStr.split(/\n/)
  const opStr = lines[2].substring(23)
  const op = old => {
    const operator = opStr[0]
    const secondValueStr = opStr.substring(opStr.lastIndexOf(' ') + 1)
    const secondValue = secondValueStr === 'old' ? old : Number(secondValueStr)
    return operator === '+' ? old + secondValue : old * secondValue
  }
  const divideBy = getLastNumber(lines[3])
  return {
    items: lines[1].substring(18).split(', ').map(Number),
    op,
    divideBy,
    getMonkeyToThrowTo: item => {
      const ifTrue = getLastNumber(lines[4])
      const ifFalse = getLastNumber(lines[5])
      return idDivisible(item, divideBy) ? ifTrue : ifFalse
    }
  }
})

const factor = monkeys.reduce((acc, monkey) => acc * monkey.divideBy, 1)

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
      let newWorryLevel = monkey.op(item) % factor
      const monkeyToThrowTo = monkey.getMonkeyToThrowTo(newWorryLevel);
      monkeys[monkeyToThrowTo].items.push(newWorryLevel)
    }
  }
}

inspections.sort((a,b)=>b-a)
console.log(inspections[0] * inspections[1])
