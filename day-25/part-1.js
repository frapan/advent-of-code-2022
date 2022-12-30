const {readFileSync} = require('fs')

const input = readFileSync('./input.txt', 'utf-8')

const lines = input.split(/\n/)

const snafu2decMap = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
}

const dec2snafuMap = {
  '2': '2',
  '1': '1',
  '0': '0',
  '3': '=',
  '4': '-',
}

const snafu2dec = snafu => {
  return snafu.split('').reverse().reduce((acc, c, i) => acc + snafu2decMap[c] * 5 ** i, 0)
}

const dec2snafu = dec => {
  let snafu = []

  while (dec !== 0) {
    const remainder = dec % 5
    snafu.unshift(dec2snafuMap[String(remainder)]);
    dec = Math.floor(dec / 5) + (remainder > 2 ? 1 : 0);
  }
  
  return snafu.join('')
}

const sum = lines.reduce((acc, line) => acc + snafu2dec(line), 0)
console.log(dec2snafu(sum))
