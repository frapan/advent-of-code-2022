const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const blueprints = input.split(/\n/).map(line => {
  const number = Number(line.match(/Blueprint (\d+):/)[1])
  const ores = line.match(/ (\d+) ore/g).map(n => parseInt(n, 10))
  const clay = Number(line.match(/ (\d+) clay/)[1])
  const obsidian = Number(line.match(/ (\d+) obsidian/)[1])
  const maxRequiredOre = Math.max(...ores)
  return {
    number,
    oreRequirements: { ore: ores[0] },
    clayRequirements: { ore: ores[1] },
    obsidianRequirements: { ore: ores[2], clay },
    geodeRequirements: { ore: ores[2], obsidian },
    maxRequiredOre,
  }
})
// const oreRequirements = {ore: 4}
// const clayRequirements = {ore: 2}
// const obsidianRequirements = {ore: 3, clay: 14}
// const geodeRequirements = {ore: 2, obsidian: 7}
// const oreRequirements = {ore: 2}
// const clayRequirements = {ore: 3}
// const obsidianRequirements = {ore: 3, clay: 8}
// const geodeRequirements = {ore: 3, obsidian: 12}

const materials = ['geode', 'obsidian', 'clay', 'ore']

const getNewConfig = (config, blueprint) => {
  const newConfigBase = {
    ...config,
    minute: config.minute + 1,
    bag: { ... config.bag },
    robots: { ... config.robots },
    robotsUnderConstruction: { ... config.robotsUnderConstruction },
  }
  
  materials.forEach(material => {
    if (newConfigBase.robotsUnderConstruction[material] > 0) {
      newConfigBase.robotsUnderConstruction[material] = 0
      newConfigBase.robots[material]++
    }
  })
  
  materials.forEach(material => newConfigBase.bag[material] += newConfigBase.robots[material])

  if (config.minute === 24) {
    return newConfigBase.bag.geode
  }

  const possibleNewConfigs = []
  if (config.bag.obsidian >= blueprint.geodeRequirements.obsidian && config.bag.ore >= blueprint.geodeRequirements.ore) {
    possibleNewConfigs.push({
      ...newConfigBase,
      bag: {
        ...newConfigBase.bag,
        ore: newConfigBase.bag.ore - blueprint.geodeRequirements.ore,
        obsidian: newConfigBase.bag.obsidian - blueprint.geodeRequirements.obsidian,
      },
      robotsUnderConstruction: {
        ...newConfigBase.robotsUnderConstruction,
        geode: 1
      }
    })
    return getNewConfig(possibleNewConfigs[0], blueprint)
  }
  let missingOreToCreateGeode = 0
  if (config.bag.obsidian === blueprint.geodeRequirements.obsidian) {
    missingOreToCreateGeode = blueprint.geodeRequirements.ore - config.bag.ore
  }

  if (config.bag.clay >= blueprint.obsidianRequirements.clay && config.bag.ore - missingOreToCreateGeode >= blueprint.obsidianRequirements.ore) {
    possibleNewConfigs.push({
      ...newConfigBase,
      bag: {
        ...newConfigBase.bag,
        ore: newConfigBase.bag.ore - blueprint.obsidianRequirements.ore,
        clay: newConfigBase.bag.clay - blueprint.obsidianRequirements.clay,
      },
      robotsUnderConstruction: {
        ...newConfigBase.robotsUnderConstruction,
        obsidian: 1
      }
    })
    return getNewConfig(possibleNewConfigs[0], blueprint)
  }
  let missingOreToCreateObsidian = 0
  if (config.bag.clay === blueprint.obsidianRequirements.clay) {
    missingOreToCreateObsidian = blueprint.obsidianRequirements.ore - config.bag.ore
  }
  
  if (config.bag.ore - Math.max(missingOreToCreateGeode, missingOreToCreateObsidian) >= blueprint.clayRequirements.ore) {
    possibleNewConfigs.push({
      ...newConfigBase,
      bag: {
        ...newConfigBase.bag,
        ore: newConfigBase.bag.ore - blueprint.clayRequirements.ore,
      },
      robotsUnderConstruction: {
        ...newConfigBase.robotsUnderConstruction,
        clay: 1
      }
    })
  }

  if (config.bag.ore - Math.max(missingOreToCreateGeode, missingOreToCreateObsidian) >= blueprint.oreRequirements.ore) {
    possibleNewConfigs.push({
      ...newConfigBase,
      bag: {
        ...newConfigBase.bag,
        ore: newConfigBase.bag.ore - blueprint.oreRequirements.ore,
      },
      robotsUnderConstruction: {
        ...newConfigBase.robotsUnderConstruction,
        ore: 1
      }
    })
  }

  if (config.bag.ore < blueprint.maxRequiredOre * 2) {
    possibleNewConfigs.push(newConfigBase)
  }
  
  const geodesCount = possibleNewConfigs.map(config => getNewConfig(config, blueprint))
  
  return Math.max(...geodesCount)
}

const initialConfig = {
  minute: 1,
  bag: {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
  robots: {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
  robotsUnderConstruction: {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  },
}

const results = blueprints.reduce((acc, bp) => acc + bp.number * getNewConfig(initialConfig, bp), 0)
console.log(results)
// 577 too low
// 600 is the right answer!