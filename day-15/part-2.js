const { readFileSync } = require('fs')

const AREA_SIZE = 20

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\n/)

const sensorsAndBeacons = lines.map(line => {
  const [, sensorX, sensorY] = line.match(/x=(-?\d+), y=(-?\d+)/)
  const [, beaconX, beaconY] = line.substring(20).match(/x=(-?\d+), y=(-?\d+)/)
  return {
    sensor: [sensorX, sensorY].map(Number),
    beacon: [beaconX, beaconY].map(Number),
  }
})

const allXs = sensorsAndBeacons
  .map(({sensor, beacon}) => [sensor[0], beacon[0]])
  .flat()

const horizontalSegments = new Array(AREA_SIZE)

for (const { sensor, beacon } of sensorsAndBeacons) {
  const manhattanDistance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1])
  const startY = Math.max(sensor[1] - manhattanDistance, 0)
  const endY = Math.min(sensor[1] + manhattanDistance, AREA_SIZE)
  for (let y = startY; y <= endY; y++) {
    const yDistanceFromSensor = Math.abs(sensor[1] - y)
    let startX = sensor[0] - (manhattanDistance - yDistanceFromSensor)
    let endX = sensor[0] + manhattanDistance - yDistanceFromSensor
    if (horizontalSegments[y]) {
      for (let i = horizontalSegments[y].length - 1; i >= 0; i--) {
        const segment = horizontalSegments[y][i]
        const overlaps = (segment[1] >= startX && segment[1] < endX) || (segment[0] >= startX && segment[0] < endX)
        if (overlaps) {
          startX = Math.min(startX, segment[0])
          endX = Math.max(endX, segment[1])
          horizontalSegments[y].splice(i, 1)
        }
      }
      horizontalSegments[y].push([startX, endX])
    } else {
      horizontalSegments[y] = [[startX, endX]] 
    }
  }  
}

console.log(horizontalSegments.map((s, i) => i + ') ' + s).join('\n'))