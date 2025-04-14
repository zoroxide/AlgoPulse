"use strict";

var mongoose = require('mongoose');
var sheetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Sheet', sheetSchema);