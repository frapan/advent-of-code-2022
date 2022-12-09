const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)
const knots = []
for (let i = 0; i < 10; i++) {
  knots[i] = { x: 0, y: 0 }
}
const visitedByLastKnot = new Set()
visitedByLastKnot.add('0-0')

const moveTail = (headKnot, tailKnot) => {
  if (headKnot.x > tailKnot.x + 1) {
    tailKnot.x++
    if (headKnot.y > tailKnot.y) {
      tailKnot.y++
    } else if (headKnot.y < tailKnot.y) {
      tailKnot.y--
    }
  } else if (headKnot.x < tailKnot.x - 1) {
    tailKnot.x--
    if (headKnot.y > tailKnot.y) {
      tailKnot.y++
    } else if (headKnot.y < tailKnot.y) {
      tailKnot.y--
    }
  } else if (headKnot.y > tailKnot.y + 1) {
    tailKnot.y++
    if (headKnot.x > tailKnot.x) {
      tailKnot.x++
    } else if (headKnot.x < tailKnot.x) {
      tailKnot.x--
    }
  } else if (headKnot.y < tailKnot.y - 1) {
    tailKnot.y--
    if (headKnot.x > tailKnot.x) {
      tailKnot.x++
    } else if (headKnot.x < tailKnot.x) {
      tailKnot.x--
    }
  }
}

for (let line of lines) {
  const [dir, steps] = line.split(' ')
  if (dir === 'R') {
    for(let i=0; i < Number(steps); i++) {
      knots[0].x++
      for(let k=1; k < 10; k++) {
        moveTail(knots[k - 1], knots[k])
      }
      visitedByLastKnot.add(knots[9].x + '-' + knots[9].y)
    }
  }
  if (dir === 'L') {
    for(let i=0; i < Number(steps); i++) {
      knots[0].x--
      for(let k=1; k < 10; k++) {
        moveTail(knots[k - 1], knots[k])
      }
      visitedByLastKnot.add(knots[9].x + '-' + knots[9].y)
    }
  }
  if (dir === 'U') {
    for(let i=0; i < Number(steps); i++) {
      knots[0].y++
      for(let k=1; k < 10; k++) {
        moveTail(knots[k - 1], knots[k])
      }
      visitedByLastKnot.add(knots[9].x + '-' + knots[9].y)
    }
  }
  if (dir === 'D') {
    for(let i=0; i < Number(steps); i++) {
      knots[0].y--
      for(let k=1; k < 10; k++) {
        moveTail(knots[k - 1], knots[k])
      }
      visitedByLastKnot.add(knots[9].x + '-' + knots[9].y)
    }
  }
}

console.log(visitedByLastKnot.size)


