const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const oreRequirements = {ore: 4}
const clayRequirements = {ore: 2}
const obsidianRequirements = {ore: 3, clay: 14}
const geodeRequirements = {ore: 2, obsidian: 7}
// const oreRequirements = {ore: 2}
// const clayRequirements = {ore: 3}
// const obsidianRequirements = {ore: 3, clay: 8}
// const geodeRequirements = {ore: 3, obsidian: 12}

const materials = ['geode', 'obsidian', 'clay', 'ore']

const bag = {
  ore: 0, clay: 0, obsidian: 0, geode: 0
}

const robots = {
  ore: 1, clay: 0, obsidian: 0, geode: 0,
}

const collect = {
  ore: () => {
    if (bag.ore >= oreRequirements.ore) {
      const minutesToNextGeodeCreation = Math.ceil((geodeRequirements.obsidian - bag.obsidian) / robots.obsidian)
      const keepOreToCreateGeode = geodeRequirements.ore > minutesToNextGeodeCreation
  
      const minutesToNextObsidianCreation = Math.ceil((obsidianRequirements.clay - bag.clay) / robots.clay)
      const keepOreToCreateObsidian = obsidianRequirements.ore > minutesToNextObsidianCreation
  
      const keepOreToCreateClay = robots.ore > Math.ceil(clayRequirements.ore / oreRequirements.ore)
      // const minutesToNextClayCreation = Math.ceil((clayRequirements.ore - bag.ore) / robots.ore)
      // const keepOreToCreateClay = clayRequirements.ore > minutesToNextClayCreation
  
      if (!keepOreToCreateObsidian && !keepOreToCreateGeode && !keepOreToCreateClay) {
        createRobotCountdown.ore = 0
        bag.ore = bag.ore - oreRequirements.ore
      }
    }
    bag.ore += robots.ore
  }, clay: () => {
    if (bag.ore >= clayRequirements.ore) {
      const minutesToNextGeodeCreation = Math.ceil((geodeRequirements.obsidian - bag.obsidian) / robots.obsidian)
      const keepOreToCreateGeode = geodeRequirements.ore > minutesToNextGeodeCreation
      
      const minutesToNextObsidianCreation = Math.ceil((obsidianRequirements.clay - bag.clay) / robots.clay)
      const keepOreToCreateObsidian = obsidianRequirements.ore > minutesToNextObsidianCreation

      if (!keepOreToCreateObsidian && !keepOreToCreateGeode) {
        createRobotCountdown.clay = 0
        bag.ore = bag.ore - clayRequirements.ore
      }
    }
    bag.clay += robots.clay
  }, obsidian: () => {
    if (bag.ore >= obsidianRequirements.ore && bag.obsidian < geodeRequirements.obsidian && bag.clay >= obsidianRequirements.clay) {
      const minutesToNextGeodeCreation = Math.ceil((geodeRequirements.obsidian - bag.obsidian) / robots.obsidian)
      const keepOreToCreateGeode = geodeRequirements.ore > minutesToNextGeodeCreation

      if (!keepOreToCreateGeode) {
        createRobotCountdown.obsidian = 0
        bag.ore = bag.ore - obsidianRequirements.ore
        bag.clay = bag.clay - obsidianRequirements.clay
      }
    }
    bag.obsidian += robots.obsidian
  }, geode: () => {
    if (bag.ore >= geodeRequirements.ore && bag.obsidian >= geodeRequirements.obsidian) {
      createRobotCountdown.geode = 0
      bag.ore = bag.ore - geodeRequirements.ore
      bag.obsidian = bag.obsidian - geodeRequirements.obsidian
    }
    bag.geode += robots.geode
  },
}

const createRobotCountdown = {
  ore: -1, clay: -1, obsidian: -1, geode: -1,
}

for (let minute = 1; minute <= 24; minute++) {
  null
  materials.forEach(material => {
    collect[material]()
    if (createRobotCountdown[material] >= 0) {
      if (createRobotCountdown[material] === 0) {
        robots[material]++
      }
      createRobotCountdown[material]--
    }
  })
  console.log({minute, robots, bag})
}

console.log(robots)
console.log(bag)