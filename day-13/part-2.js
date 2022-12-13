const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')
const pairs = input.split(/\n\n/).map(pair => pair.split(/\n/).map(packet => JSON.parse(packet)))

const compare = (p1, p2) => {
  if (typeof p1 === 'number' && typeof p2 === 'number') {
    return p2 - p1
  } else if (typeof p1 === 'number') {
    return compare([p1], p2)
  } else if (typeof p2 === 'number') {
    return compare(p1, [p2])
  } else {
    for(let i = 0; i < Math.min(p1.length, p2.length); i++) {
      const result = compare(p1[i], p2[i])
      if (result !== 0) {
        return result
      }
    }
    if (p1.length < p2.length) {
      return 1
    }
    if (p1.length > p2.length) {
      return -1
    }
    return 0
  }
  
}

const divider2 = [2]
const divider6 = [6]
const packets = pairs.flat().concat([divider2], [divider6]).sort(compare).reverse()

console.log((packets.indexOf(divider2) + 1) * (packets.indexOf(divider6) + 1))