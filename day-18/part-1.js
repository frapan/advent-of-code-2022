const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const cubeCoords = input.split(/\n/).map(cube => cube.split(',').map(Number))
let surfaceArea = cubeCoords.length * 6

for (let i = 0; i < cubeCoords.length; i++) {
  for (let j = i + 1; j < cubeCoords.length; j++) {
    const xDistance = Math.abs(cubeCoords[i][0] - cubeCoords[j][0])
    const yDistance = Math.abs(cubeCoords[i][1] - cubeCoords[j][1])
    const zDistance = Math.abs(cubeCoords[i][2] - cubeCoords[j][2])
    if (xDistance + yDistance + zDistance === 1) {
      surfaceArea -= 2
    }
  }
}

console.log(surfaceArea)
