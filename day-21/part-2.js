const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const fns = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

const parseInput = input => {
  const leaves = []
  const nodes = input.split(/\n/).reduce((acc, line) => {
    const [name, cmd] = line.split(': ')
    const node = {
      name,
      parentNode: null
    }
    if (cmd.indexOf(' ') > 0) {
      const [left, opSymbol, right] = cmd.split(' ')
      node.op = fns[opSymbol]
      node.opSymbol = opSymbol
      node.leftName = left
      node.rightName = right
    } else {
      node.value = Number(cmd)
      leaves.push(node)
    }
    acc[name] = node
    return acc
  }, {})
  return { nodes, leaves }  
}

const makeLinks = nodes => {
  for (const nodeName in nodes) {
    const node = nodes[nodeName]
    if (node.leftName) {
      node.left = nodes[node.leftName]
      nodes[node.leftName].parentNode = node
      node.right = nodes[node.rightName]
      nodes[node.rightName].parentNode = node
    }
  }
}

const simplify = (nodes, leaves) => {
  delete nodes.humn.value
  let node = leaves.shift()
  while (node) {
    const parentNode = node.parentNode
    if (node.name === 'humn' || node.dependsOnHumn) {
      parentNode.dependsOnHumn = true
    } else {
      if ((!('value' in parentNode)) && ('value' in parentNode.left) && ('value' in parentNode.right)) {
        parentNode.value = parentNode.op(parentNode.left.value, parentNode.right.value)
        
        const leftLeafIndex = leaves.indexOf(parentNode.left)
        if (leftLeafIndex >= 0) {
          leaves.splice(leftLeafIndex, 1)
        }
        const rightLeafIndex = leaves.indexOf(parentNode.right)
        if (rightLeafIndex >= 0) {
          leaves.splice(rightLeafIndex, 1)
        }
        delete nodes[parentNode.leftName]
        delete nodes[parentNode.rightName]
        leaves.push(parentNode)
      } else {
        if (!('value' in node)) {
          leaves.push(node)
        }
      }
    }
    node = leaves.shift()
  }

  const { leftName, rightName } = nodes.root
  let startNodeName
  if ('value' in nodes[leftName]) {
    nodes[rightName].value = nodes[leftName].value
    delete nodes[leftName]
    startNodeName = rightName
  } else {
    nodes[leftName].value = nodes[rightName].value
    delete nodes[rightName]
    startNodeName = leftName
  }
  delete nodes.root
  return startNodeName
}

const invertOp = (currentNode, fromNode, invertedNodes, invertedLeaves) => {
  let parentNode
  if ('value' in fromNode.right) {
    parentNode = {
      name: fromNode.left.name,
      parentNode: null,
    }
    if (fromNode.opSymbol === '/') {
      parentNode.opSymbol = '*'
    } else if (fromNode.opSymbol === '*') {
      parentNode.opSymbol = '/'
    } else if (fromNode.opSymbol === '+') {
      parentNode.opSymbol = '-'
    } else if (fromNode.opSymbol === '-') {
      parentNode.opSymbol = '+'
    } 
    parentNode.op = fns[parentNode.opSymbol]
    parentNode.rightName = fromNode.right.name
    parentNode.right = {
      name: fromNode.right.name,
      parentNode,
      value: fromNode.right.value,
    }
  } else {
    parentNode = {
      name: fromNode.right.name,
      parentNode: null,
    }
    if (fromNode.opSymbol === '/') {
      parentNode.opSymbol = '/'
    } else if (fromNode.opSymbol === '*') {
      parentNode.opSymbol = '/'
    } else if (fromNode.opSymbol === '+') {
      parentNode.opSymbol = '-'
    } else if (fromNode.opSymbol === '-') {
      parentNode.opSymbol = '-'
    }
    parentNode.op = fns[parentNode.opSymbol]
    parentNode.rightName = fromNode.left.name
    parentNode.right = {
      name: fromNode.left.name,
      parentNode,
      value: fromNode.left.value,
    }
  }

  parentNode.leftName = currentNode.name
  parentNode.left = currentNode
  currentNode.parentNode = parentNode
  invertedNodes[parentNode.name] = parentNode
  invertedNodes[parentNode.right.name] = parentNode.right
  invertedLeaves.push(parentNode.right)
  return parentNode.name
}

const invert = (nodes, startNodeName) => {
  const invertedNodes = {}
  const invertedLeaves = []
  let fromNode = nodes[startNodeName]
  const node = {
    name: fromNode.name,
    parentNode: null,
    value: fromNode.value
  }
  invertedNodes[node.name] = node
  let currNodeName = startNodeName
  while (currNodeName !== 'humn') {
    currNodeName = invertOp(invertedNodes[currNodeName], nodes[currNodeName], invertedNodes, invertedLeaves)
  }
  return { invertedNodes, invertedLeaves }
}

const calculateHumn = (nodes, leaves) => {
  let node = leaves.shift()
  while (node) {
    const parentNode = node.parentNode
    if (!parentNode.value && parentNode.left.value && parentNode.right.value) {
      parentNode.value = parentNode.op(parentNode.left.value, parentNode.right.value)
      if (parentNode.value !== Math.floor(parentNode.value)) {
        console.log(parentNode)
      }
      if (parentNode.name === 'humn') {
        return parentNode.value
      }
      leaves.push(parentNode)
    } else {
      leaves.push(node)
    }
    node = leaves.shift()
  }
}

const { nodes, leaves } = parseInput(input)
makeLinks(nodes)
const startNodeName = simplify(nodes, leaves)
const { invertedNodes, invertedLeaves } = invert(nodes, startNodeName)
const humnValue = calculateHumn(invertedNodes, invertedLeaves)

console.log(humnValue)

const printNodes = nodes => {
  Object.keys(nodes).sort().forEach(nodeName => {
    const node = nodes[nodeName]
    console.log(node.name, node.value, node.left?.name, node.opSymbol, node.right?.name)
  })
}

printNodes(invertedNodes)
// -3740214170598.308 wrong