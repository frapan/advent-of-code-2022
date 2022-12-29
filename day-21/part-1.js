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
      parentNode: null,
    }
    if (cmd.indexOf(' ') > 0) {
      const [left, opSymbol, right] = cmd.split(' ')
      node.op = fns[opSymbol]
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

const calculateRoot = (nodes, leaves) => {
  let node = leaves.shift()
  while (node) {
    const parentNode = node.parentNode
    if (!parentNode.value && parentNode.left.value && parentNode.right.value) {
      parentNode.value = parentNode.op(parentNode.left.value, parentNode.right.value)
      if (parentNode.name === 'root') {
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
const rootValue = calculateRoot(nodes, leaves)

console.log(rootValue)