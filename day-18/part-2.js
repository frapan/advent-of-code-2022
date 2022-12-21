const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const cubeCoords = input.split(/\n/)
let surfaceArea = cubeCoords.length * 6
let maxX = 0
let maxY = 0
let maxZ = 0

for (let i = 0; i < cubeCoords.length; i++) {
  const coords1 = cubeCoords[i].split(',').map(Number)
  if (coords1[0] > maxX) maxX = coords1[0]
  if (coords1[1] > maxY) maxY = coords1[1]
  if (coords1[2] > maxZ) maxZ = coords1[2]
  for (let j = i + 1; j < cubeCoords.length; j++) {
    const coords2 = cubeCoords[j].split(',').map(Number)
    const xDistance = Math.abs(coords1[0] - coords2[0])
    const yDistance = Math.abs(coords1[1] - coords2[1])
    const zDistance = Math.abs(coords1[2] - coords2[2])
    if (xDistance + yDistance + zDistance === 1) {
      surfaceArea -= 2
    }
  }
}

const joinCoords = (x, y, z) => x + ',' + y + ',' + z

const cubesSet = new Set(cubeCoords)

const visitedCubes = new Set()
const trappedCubes = new Set()

const checkTrapped = (x, y, z) => {
  const joinedCoords = joinCoords(x, y, z)
  visitedCubes.add(joinedCoords)

  let leftXTrapped = false
  for (let leftX = x - 1; leftX >= 0 && !leftXTrapped; leftX--) {
    const leftJoined = joinCoords(leftX, y, z)
    if (cubesSet.has(leftJoined)) {
      leftXTrapped = true
    } else if (trappedCubes.has(leftJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(leftJoined)) {
      leftXTrapped = checkTrapped(leftX, y, z)
      if (leftXTrapped) {
        return true
      }
      break
    }
  }
  if (!leftXTrapped) {
    return false
  }

  let rightXTrapped = false
  for (let rightX = x + 1; rightX <= maxX && !rightXTrapped; rightX++) {
    const rightJoined = joinCoords(rightX, y, z)
    if (cubesSet.has(rightJoined)) {
      rightXTrapped = true
    } else if (trappedCubes.has(rightJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(rightJoined)) {
      rightXTrapped = checkTrapped(rightX, y, z)
      if (rightXTrapped) {
        return true
      }
    }
  }
  if (!rightXTrapped) {
    return false
  }

  let leftYTrapped = false
  for (let leftY = y - 1; leftY >= 0 && !leftYTrapped; leftY--) {
    const leftJoined = joinCoords(x, leftY, z)
    if (cubesSet.has(leftJoined)) {
      leftYTrapped = true
    } else if (trappedCubes.has(leftJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(leftJoined)) {
      leftYTrapped = checkTrapped(x, leftY, z)
      if (leftYTrapped) {
        return true
      }
      break
    }
  }
  if (!leftYTrapped) {
    return false
  }

  let rightYTrapped = false
  for (let rightY = x + 1; rightY <= maxY && !rightYTrapped; rightY++) {
    const rightJoined = joinCoords(x, rightY, z)
    if (cubesSet.has(rightJoined)) {
      rightYTrapped = true
    } else if (trappedCubes.has(rightJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(rightJoined)) {
      rightYTrapped = checkTrapped(x, rightY, z)
      if (rightYTrapped) {
        return true
      }
    }
  }
  if (!rightYTrapped) {
    return false
  }

  let leftZTrapped = false
  for (let leftZ = z - 1; leftZ >= 0 && !leftZTrapped; leftZ--) {
    const leftJoined = joinCoords(x, y, leftZ)
    if (cubesSet.has(leftJoined)) {
      leftZTrapped = true
    } else if (trappedCubes.has(leftJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(leftJoined)) {
      leftZTrapped = checkTrapped(x, y, leftZ)
      if (leftZTrapped) {
        return true
      }
      break
    }
  }
  if (!leftZTrapped) {
    return false
  }

  let rightZTrapped = false
  for (let rightZ = z + 1; rightZ <= maxZ && !rightZTrapped; rightZ++) {
    const rightJoined = joinCoords(x, y, rightZ)
    if (cubesSet.has(rightJoined)) {
      rightZTrapped = true
    } else if (trappedCubes.has(rightJoined)) {
      trappedCubes.add(joinedCoords)
      return true
    } else if (!visitedCubes.has(rightJoined)) {
      rightZTrapped = checkTrapped(x, y, rightZ)
      if (rightZTrapped) {
        return true
      }
    }
  }
  if (!rightZTrapped) {
    return false
  }

  if (leftXTrapped && rightXTrapped && leftYTrapped && rightYTrapped && leftZTrapped && rightZTrapped) {
    trappedCubes.add(joinedCoords)
    return true
  }
  return false
}

for (let z = 1; z <= maxZ - 1; z++) {
  for (let y = 1; y <= maxY - 1; y++) {
    for (let x = 1; x <= maxX - 1; x++) {
      const joinedCoords = joinCoords(x, y, z)
      if (!cubesSet.has(joinedCoords)) {
        checkTrapped(x, y, z)
      }
    }
  }
}


let externalSurfaceArea = 0
for (let x = 0; x <= maxX; x++) {
  for (let y = 0; y <= maxY; y++) {
    let previousCubeEmpty = true
    for (let z = 0; z <= maxZ; z++) {
      const joinedCoords = joinCoords(x, y, z)
      if (trappedCubes.has(joinedCoords) || trappedCubes.has(joinCoords(x, y, z - 1))) {
        continue
      }
      if (cubesSet.has(joinedCoords) && previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = false
      } else if (!cubesSet.has(joinedCoords) && !previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = true
      }
    }
    if (!previousCubeEmpty) {
      externalSurfaceArea++
    }
  }
}

for (let z = 0; z <= maxZ; z++) {
  for (let x = 0; x <= maxX; x++) {
    let previousCubeEmpty = true
    for (let y = 0; y <= maxY; y++) {
      const joinedCoords = joinCoords(x, y, z)
      if (trappedCubes.has(joinedCoords) || trappedCubes.has(joinCoords(x, y - 1, z))) {
        continue
      }
      if (cubesSet.has(joinedCoords) && previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = false
      } else if (!cubesSet.has(joinedCoords) && !previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = true
      }
    }
    if (!previousCubeEmpty) {
      externalSurfaceArea++
    }
  }
}

for (let y = 0; y <= maxY; y++) {
  for (let z = 0; z <= maxZ; z++) {
    let previousCubeEmpty = true
    for (let x = 0; x <= maxX; x++) {
      const joinedCoords = joinCoords(x, y, z)
      if (trappedCubes.has(joinedCoords) || trappedCubes.has(joinCoords(x - 1, y, z))) {
        continue
      }
      if (cubesSet.has(joinedCoords) && previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = false
      } else if (!cubesSet.has(joinedCoords) && !previousCubeEmpty) {
        externalSurfaceArea++
        previousCubeEmpty = true
      }
    }
    if (!previousCubeEmpty) {
      externalSurfaceArea++
    }
  }
}

console.log(surfaceArea, externalSurfaceArea, trappedCubes.size)
// 2096 too low
// 2562 too high