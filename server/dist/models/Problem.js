"use strict";

var mongoose = require('mongoose');

//extrenal schema
var testcaseSchema = new mongoose.Schema({
  input: {
    type: String,
    deault: ''
  },
  // default value is empty string for only one input problems (ex: Hello World)
  output: {
    type: String,
    required: true
  }
});
var problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  testcases: {
    type: [testcaseSchema],
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Problem', problemSchema);