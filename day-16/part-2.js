const { readFileSync } = require('fs')

const input = readFileSync('./input.txt', 'utf-8')
const lines = input.split(/\n/)

const valves = lines.reduce((acc, line) => {
  const name = line.substring(6, 8)
  const flowRate = Number(line.match(/rate=(\d+)/)[1])
  const childrenValves = line.match(/valve.? (.*)/)[1].split(', ')
  acc[name] = {
    flowRate,
    nextValves: childrenValves.reduce((nextAcc, valveName) => {
      nextAcc[valveName] = 1
      return nextAcc
    }, {})
  }
  return acc
}, {})

// console.log(valves)

const valvesWithFlowRate = ['AA', ...Object.keys(valves).filter(name => valves[name].flowRate)]
// console.log(valvesWithFlowRate)

/* Source: https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-dijkstras-algorithm-8d16451eea34
const sampleProblem = {
  start: {A: 5, B: 2},
  A: {C: 4, D: 2},
  B: {A: 8, D: 7},
  C: {D: 6, finish: 3},
  D: {finish: 1},
  finish: {}
};
*/
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
  distances = Object.assign(distances, graph[startNode].nextValves);
// track paths using a hash object
  let parents = { endNode: null };
  for (let child in graph[startNode].nextValves) {
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
    let children = graph[node].nextValves;

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

let distancesBetweenValves = {}
for (const startValve of valvesWithFlowRate) {
  for (const endValve of valvesWithFlowRate) {
    if (startValve !== endValve) {
      distancesBetweenValves[startValve + '-' + endValve] = findShortestPath(valves, startValve, endValve).distance
    }
  }
}

// console.log(distancesBetweenValves)

const TIME_TO_OPEN_VALVE = 1

const getMaxFlowPath = (path, remainingMinutes, availableValves) => {
  if (remainingMinutes <= 0) {
    return [[], 0]
  }
  const lastValveName = path[path.length - 1] 
  let bestPath = [lastValveName]
  let bestPathFlowRate = 0
  for (let i = 0; i < availableValves.length; i++) {
    const nextValveName = availableValves[i]
    if (nextValveName !== lastValveName && !path.includes(nextValveName)) {
      const newRemainingMinutes = remainingMinutes - distancesBetweenValves[lastValveName + '-' + nextValveName] - TIME_TO_OPEN_VALVE
      const newPathFlowRate = newRemainingMinutes * valves[nextValveName].flowRate
      const newPath = path.concat(nextValveName)
      const [childPath, childPathFlowRate] = getMaxFlowPath(newPath, newRemainingMinutes, availableValves)
      const currentBestFlowRate = newPathFlowRate + childPathFlowRate
      if (currentBestFlowRate > bestPathFlowRate) {
        bestPathFlowRate = currentBestFlowRate
        bestPath = [lastValveName].concat(childPath)
      }
    }
  }
  return [ bestPath, bestPathFlowRate ]
}


function getCombinations(valuesArray)
{

  const combi = [];
  let temp = [];
  const slent = Math.pow(2, valuesArray.length);

  for (let i = 0; i < slent; i++)
  {
    temp = [];
    for (let j = 0; j < valuesArray.length; j++)
    {
      if ((i & Math.pow(2, j)))
      {
        temp.push(valuesArray[j]);
      }
    }
    if (temp.length > 0)
    {
      combi.push(temp);
    }
  }

  combi.sort((a, b) => a.length - b.length);
  // console.log(combi.join("\n"));
  return combi;
}

const half = Math.floor(valvesWithFlowRate.length / 2)

const goodGroups = getCombinations(valvesWithFlowRate).filter(group => group.length === half)

let bestFlowRate = 0
let myBestPath, elephantBestPath
for (const myGroup of goodGroups) {
  const elephantGroup = valvesWithFlowRate.filter(v => !myGroup.includes(v))
  const [ myPath, myPathFlowRate ] = getMaxFlowPath(['AA'], 26, myGroup)
  const [ elephantPath, elephantPathFlowRate ] = getMaxFlowPath(['AA'], 26, elephantGroup)
  const sum = myPathFlowRate + elephantPathFlowRate
  if (sum > bestFlowRate) {
    bestFlowRate = sum
    myBestPath = myPath
    elephantBestPath = elephantPath
  }
}
console.log({bestFlowRate, myBestPath, elephantBestPath})
