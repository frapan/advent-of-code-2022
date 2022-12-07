const { readFileSync } = require('fs')

const printNode = (node, level) => {
  console.log('  '.repeat(level) + `${node.dirName} (fileSize: ${node.fileSize}, dirSize: ${node.dirSize})`)
  node.childrenNodes.forEach(n => printNode(n, level + 1))
}

const line = readFileSync('./input.txt', 'utf-8')

const lines = line.split(/\r?\n/)

const rootNode = {
  dirName: '/',
  fileSize: 0,
  dirSize: 0,
  childrenNodes: [],
  parentNode: null,
  visited: false,
}

let currentNode = null
let lsInProgress = false

for (const line of lines) {
  if (line.startsWith('$ cd ')) {
    if (line[0] === '$') {
      if (lsInProgress) {
        lsInProgress = false
        currentNode.visited = true
      }
    }

    const dirName = line.substring(5)
    switch (dirName) {
      case '/': {
        currentNode = rootNode
        break
      }
      case '..': {
        currentNode = currentNode.parentNode
        break
      }
      default: {
        let childNode = currentNode.childrenNodes.find(n => n.dirName === dirName)
        if (!childNode) {
          childNode = {
            dirName,
            fileSize: 0,
            dirSize: 0,
            childrenNodes: [],
            parentNode: currentNode
          }
          currentNode.childrenNodes.push(childNode)
        }
        currentNode = childNode
      }
    }
  } else if (Number(line[0]) <= 9) {
    if (!currentNode.visited) {
      lsInProgress = true
      const size = parseInt(line)
      currentNode.fileSize += size
    }
  }
}

let sumOfAtMost100000 = 0
const calculateDirSize = (node) => {
  if (!node.childrenNodes.length) {
    node.dirSize = node.fileSize
  } else {
    node.dirSize = node.fileSize + node.childrenNodes.reduce((acc, node) => acc + calculateDirSize(node), 0)
  }
  if (node.dirSize <= 100000) {
    sumOfAtMost100000 += node.dirSize
  }
  return node.dirSize
}

calculateDirSize(rootNode)

console.log(sumOfAtMost100000)

// printNode(rootNode, 0)


