'use strict';

const fs = require('fs')
const path = require('path');
const syllable = require('./syllableBreak');

const hwFile = fs.readFileSync(
  path.join(__dirname, '../rawdata/headWords.txt'),
  'utf-8'
).split('\n');

const head_words = hwFile
  .filter((word) => word.trim().length > 1)
  .map((word) => word.trim().replace(/\u200b/g, ''))
  .map((word) => syllable(word).replace(/\u200b$/, ''))
  .map((word) => word.trim())

// head_words.forEach((word) => {
//   console.log(syllable(word))
// })

// // .map((word) => word.split(''))
// // .map((word) => syllable(word).split('\u200b'))

// "ပ|ရော်|ဆက်|ဆာ|ကင်|မ|ရာ|နဲ့|ဒီ|ဇိုင်း|ပိုင်း မှာ|တော့| အ|ဆို|ပါ|စ|မတ်|ဖုန်း|ဗား|ရှင်း|နှစ်|ခု|တူ|ညီ|မှာ|ဖြစ်|ပါ|တယ်"
// let head_words = "ပ|ရော်|ဆက်|ဆာ ကင်|မ|ရာ နဲ့ ဒီ|ဇိုင်း|ပိုင်း ပိုင်း မှာ တော့ အ|ဆို အ|ဆို|ပါ စ|မတ် ဖုန်း ရှင်း နှစ် နှစ်|ခု တူ|ညီ ညီ ဖြစ် ပါ|တယ်".split(' ');

let hash_table = {};

head_words.forEach((word) => {
  let syllables = word.split('\u200b');
  let ref = hash_table;

  while (syllables.length > 0) {
    let x = syllables.shift();

    if (!ref[x]) {
      ref[x] = {
        isOwnGram: syllables.length === 0,
        // all: [x + syllables.join('')]
      };
    } else {
      // ref[x].all.push( x + syllables.join(''))
    }

    ref = ref[x];
  }
});

module.exports = {
  hash_table,
  head_words: head_words.map((word) => word.replace(/\|/g, '')),
  syllable
};
