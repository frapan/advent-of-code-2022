import fs from 'fs'

const input = fs.readFileSync('./input.txt', 'utf-8')

const turns = input.split(/\r?\n/)

const shapePoint = {
    X: 1,
    Y: 2,
    Z: 3
}

const turnPoint = {
    'A X': 3,
    'A Y': 6,
    'A Z': 0,
    'B X': 0,
    'B Y': 3,
    'B Z': 6,
    'C X': 6,
    'C Y': 0,
    'C Z': 3,
}

const points = turns.reduce((acc, turn) => acc + turnPoint[turn] + shapePoint[turn[2]], 0)
//const points = turns.reduce((acc, turn) => console.log(turn), 0)
console.log(points)
