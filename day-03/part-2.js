const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const rucksacks = input.split(/\r?\n/)

const getPriority = itemType =>
  itemType >= 'a' ?
    itemType.charCodeAt(0) - 'a'.charCodeAt(0) + 1 :
    itemType.charCodeAt(0) - 'A'.charCodeAt(0) + 27

const getCommonItemType = (items1, items2, items3) =>
  items1.split('').filter(c => items2.includes(c)).find(c => items3.includes(c))

const groupedByThree = rucksacks.reduce((acc, rucksack, i) => {
  acc[i%3] = (acc[i%3] || []).concat(rucksack)
  return acc
}, [])

const sumOfPriorities = groupedByThree[0].reduce((acc, _, i) =>
    acc + getPriority(
      getCommonItemType(
        groupedByThree[0][i],
        groupedByThree[1][i],
        groupedByThree[2][i])),
  0)

console.log(sumOfPriorities)
