const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)
const numberOfStacks = (lines[0].length + 1) / 4

const parseLines = (lines) => {
  const [stacks, moves] = lines.reduce(([stacks, moves], line) => {
    if (line.indexOf('[') >= 0) {
      for (let stackIndex = 0; stackIndex < numberOfStacks; stackIndex++) {
        const crate = line[stackIndex * 4 + 1]
        if (crate !== ' ') {
          if (!stacks[stackIndex]) {
            stacks[stackIndex] = []
          }
          stacks[stackIndex].push(crate)
        }
      }
    }
    if (line.startsWith('move')) {
      const [,count,,from,,to] = line.split(' ').map(Number)
      moves.push({ count, from, to })
    }
    return [stacks, moves]
  }, [[],[]])
  stacks.forEach(stack => stack.reverse())
  return [stacks, moves]
}

const [stacks, moves] = parseLines(lines)

for (const move of moves) {
  const movedCranes = stacks[move.from - 1].splice(0 - move.count, move.count)
  stacks[move.to - 1] = stacks[move.to - 1].concat(movedCranes)
}

// console.log(stacks, moves)
console.log(stacks.map(stack => stack.pop()).join(''))
