'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect('localhost/openmmnlp');

const WordSchema  = new Schema({
  word: { type: String, index: { uniqued: true }},
  types: { type: [String] },
  pos_tag: String
}, {
  timestamp: true,
  strict: false
});

const Word    = mongoose.model('Word', WordSchema)

module.exports = {
  Word
}
