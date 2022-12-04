const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const rucksacks = input.split(/\r?\n/)

const getPriority = itemType =>
  itemType >= 'a' ?
    itemType.charCodeAt(0) - 'a'.charCodeAt(0) + 1 :
    itemType.charCodeAt(0) - 'A'.charCodeAt(0) + 27

const getCommonItemType = (items1, items2) =>
  items1.split('').find(c => items2.includes(c))

const sumOfPriorities = rucksacks.reduce((acc, rucksack) =>
  acc + getPriority(
    getCommonItemType(
      rucksack.slice(0, rucksack.length / 2),
      rucksack.slice(rucksack.length / 2))),
  0)

console.log(sumOfPriorities)
