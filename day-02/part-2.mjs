import fs from 'fs'

const input = fs.readFileSync('./input.txt', 'utf-8')

const turns = input.split(/\r?\n/)

const turnPoint = {
    X: 0,
    Y: 3,
    Z: 6
}

const shapePoint = {
    'A X': 3,
    'A Y': 1,
    'A Z': 2,
    'B X': 1,
    'B Y': 2,
    'B Z': 3,
    'C X': 2,
    'C Y': 3,
    'C Z': 1,
}

const points = turns.reduce((acc, turn) => acc + shapePoint[turn] + turnPoint[turn[2]], 0)
//const points = turns.reduce((acc, turn) => console.log(turn), 0)
console.log(points)
