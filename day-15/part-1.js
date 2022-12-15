const { readFileSync } = require('fs')

const TARGET_Y = 2000000

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

const impossiblePositions = sensorsAndBeacons.reduce((acc, {sensor, beacon}) => {
  const manhattanDistance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1])
  const targetYDistance = Math.abs(sensor[1] - TARGET_Y)
  if (targetYDistance <= manhattanDistance) {
    const startX = sensor[0] - manhattanDistance + targetYDistance
    const endX = sensor[0] + manhattanDistance - targetYDistance
    for (let x = startX; x <= endX; x++) {
      acc.add(x)
    }
  }
  return acc
}, new Set())

sensorsAndBeacons.forEach(({sensor, beacon}) => {
  if (beacon[1] === TARGET_Y) {
    impossiblePositions.delete(beacon[0])
  }
})

console.log(impossiblePositions.size)