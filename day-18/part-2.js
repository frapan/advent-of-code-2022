const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const cubesSet = new Set(input.split(/\n/))
let maxX = 0
let maxY = 0
let maxZ = 0

const joinCoords = (x, y, z) => x + ',' + y + ',' + z
const splitCoords = (joinedCoords) => joinedCoords.split(',').map(Number)

for (const coordsStr of cubesSet) {
  const coords = splitCoords(coordsStr)
  if (coords[0] > maxX) maxX = coords[0]
  if (coords[1] > maxY) maxY = coords[1]
  if (coords[2] > maxZ) maxZ = coords[2]
}

let externalSurfaceArea = 0

function checkNextCube(joinedCoords, visitedCubes, joinedCoordsToVisit) {
  if (visitedCubes.has(joinedCoords)) {
    return
  }

  if (cubesSet.has(joinedCoords)) {
    externalSurfaceArea++
  } else {
    joinedCoordsToVisit.add(joinedCoords)
  }
}

const visitExternalCube = (startX, startY, startZ) => {
  const visitedCubes = new Set()
  
  const joinedCoordsToVisit = new Set([joinCoords(startX, startY, startZ)])
  while(joinedCoordsToVisit.size) {
    const joinedCoords = joinedCoordsToVisit.keys().next().value
    joinedCoordsToVisit.delete(joinedCoords)
    const [x, y, z] = splitCoords(joinedCoords)
    visitedCubes.add(joinedCoords)

    if (x > -1) {
      checkNextCube(joinCoords(x - 1, y, z), visitedCubes, joinedCoordsToVisit);
    }
    if (x < maxX + 1) {
      checkNextCube(joinCoords(x + 1, y, z), visitedCubes, joinedCoordsToVisit);
    }
    if (y > -1) {
      checkNextCube(joinCoords(x, y - 1, z), visitedCubes, joinedCoordsToVisit);
    }
    if (y < maxY + 1) {
      checkNextCube(joinCoords(x, y + 1, z), visitedCubes, joinedCoordsToVisit);
    }
    if (z > -1) {
      checkNextCube(joinCoords(x, y, z- 1), visitedCubes, joinedCoordsToVisit);
    }
    if (z < maxZ + 1) {
      checkNextCube(joinCoords(x, y, z+ 1), visitedCubes, joinedCoordsToVisit);
    }
  }
} 

visitExternalCube(-1, -1, -1)
console.log(externalSurfaceArea)
