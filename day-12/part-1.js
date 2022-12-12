const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')
const lines = input.split(/\n/)

let start, end

const getNodeName = (y, x) => [y, x].join()

const matrix = lines.reduce((acc, line, y) => {
  for (let x = 0; x < line.length; x++) {
    acc[y] = acc[y] || []
    if (line[x] === 'S') {
      start = getNodeName(y, x)
      acc[y][x] = 'a'.charCodeAt(0)
    } else if (line[x] === 'E') {
      end = getNodeName(y, x)
      acc[y][x] = 'z'.charCodeAt(0)
    } else {
      acc[y][x] = line[x].charCodeAt(0)
    }
  }
  return acc
}, [])

const problem = matrix.reduce((acc, row, y) => {
  for(let x=0; x<row.length; x++) {
    const nodeName = getNodeName(y, x)
    acc[nodeName] = {}
    const nodeValue = row[x]
    if (x > 0 && matrix[y][x - 1] <= nodeValue + 1) {
      acc[nodeName][getNodeName(y,x - 1)] = 1
    }
    if (x < row.length -1 && matrix[y][x + 1] <= nodeValue + 1) {
      acc[nodeName][getNodeName(y,x + 1)] = 1
    }
    if (y > 0 && matrix[y - 1][x] <= nodeValue + 1) {
      acc[nodeName][getNodeName(y - 1, x)] = 1
    }
    if (y < matrix.length - 1 && matrix[y + 1][x] <= nodeValue + 1) {
      acc[nodeName][getNodeName(y + 1, x)] = 1
    }
  }
  return acc
}, {})

// Source: https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34
const sampleProblem = {
  start: {A: 5, B: 2},
  A: {C: 4, D: 2},
  B: {A: 8, D: 7},
  C: {D: 6, finish: 3},
  D: {finish: 1},
  finish: {}
};

const shortestDistanceNode = (distances, visited) => {
  // create a default value for shortest
  let shortest = null;

  // for each node in the distances object
  for (let node in distances) {
    // if no node has been assigned to shortest yet
    // or if the current node's distance is smaller than the current shortest
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest];

    // and if the current node is in the unvisited set
    if (currentIsShortest && !visited.includes(node)) {
      // update shortest to be the current node
      shortest = node;
    }
  }
  return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {

  // track distances from the start node using a hash object
  let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);
// track paths using a hash object
  let parents = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  // collect visited nodes
  let visited = [];
// find the nearest node
  let node = shortestDistanceNode(distances, visited);

  // for that node:
  while (node) {
    // find its distance from the start node & its child nodes
    let distance = distances[node];
    let children = graph[node];

    // for each of those child nodes:
    for (let child in children) {

      // make sure each child node is not the start node
      if (String(child) === String(startNode)) {
        continue;
      } else {
        // save the distance from the start node to the child node
        let newdistance = distance + children[child];
// if there's no recorded distance from the start node to the child node in the distances object
// or if the recorded distance is shorter than the previously stored distance from the start node to the child node
        if (!distances[child] || distances[child] > newdistance) {
// save the distance to the object
          distances[child] = newdistance;
// record the path
          parents[child] = node;
        }
      }
    }
    // move the current node to the visited set
    visited.push(node);
// move to the nearest neighbor node
    node = shortestDistanceNode(distances, visited);
  }

  // using the stored paths from start node to end node
  // record the shortest path
  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  //this is the shortest path
  let results = {
    distance: distances[endNode],
    path: shortestPath,
  };
  // return the shortest path & the end node's distance from the start node
  return results;
};

console.log(findShortestPath(problem, start, end));
