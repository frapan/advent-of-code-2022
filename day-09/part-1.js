const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\r?\n/)
let headX = 0
let headY = 0
let tailX = 0
let tailY = 0
const visited = new Set()
visited.add(tailX + '-' + tailY)

const moveTail = () => {
  if (headX > tailX + 1) {
    tailX++
    if (headY > tailY) {
      tailY++
    } else if (headY < tailY) {
      tailY--
    }
  } else if (headX < tailX - 1) {
    tailX--
    if (headY > tailY) {
      tailY++
    } else if (headY < tailY) {
      tailY--
    }
  } else if (headY > tailY + 1) {
    tailY++
    if (headX > tailX) {
      tailX++
    } else if (headX < tailX) {
      tailX--
    }
  } else if (headY < tailY - 1) {
    tailY--
    if (headX > tailX) {
      tailX++
    } else if (headX < tailX) {
      tailX--
    }
  }
  visited.add(tailX + '-' + tailY)
}

for (let line of lines) {
  const [dir, steps] = line.split(' ')
  if (dir === 'R') {
    for(let i=0; i < Number(steps); i++) {
      headX++
      moveTail()
    }
  }
  if (dir === 'L') {
    for(let i=0; i < Number(steps); i++) {
      headX--
      moveTail()
    }
  }
  if (dir === 'U') {
    for(let i=0; i < Number(steps); i++) {
      headY++
      moveTail()
    }
  }
  if (dir === 'D') {
    for(let i=0; i < Number(steps); i++) {
      headY--
      moveTail()
    }
  }
}

console.log(visited.size)


