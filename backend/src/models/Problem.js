const mongoose = require('mongoose');

// external schema
const testcaseSchema = new mongoose.Schema({
  inputs: { type: [String], required: true },
  outputs: { type: [String], required: true },
});

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  testcases: { type: [testcaseSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
