'use strict';

const fs      = require('fs');
const db      = require('./db');
const path    = require('path');

const headWords = fs.readFileSync(
  path.join(__dirname, '../rawdata/headWords.txt'),
  'utf-8'
).split('\n');

let words = headWords
  .filter((word) => word.trim().length > 1);

console.log(words.length);

Promise.all(words.map((word) => {
  return db.Word.findOneAndUpdate({
    word: word
  }, {
    $set: {
      word: word
    },
    $addToSet: {
      types: 'hw'
    }
  }, {
    upsert: true
  }).exec()
}))
.then(() => {
  console.log('Success');
  process.exit();
})
.catch((err) => {
  console.error(err.stack);
  process.exit();
})
