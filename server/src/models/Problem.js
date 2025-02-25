const mongoose = require('mongoose');
const testcaseSchema = require('./TestCase');

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  testcases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
