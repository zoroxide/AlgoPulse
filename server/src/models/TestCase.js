const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
  input: { type: String, deault: '' },  // default value is empty string for only one input problems (ex: Hello World)
  output: { type: String, required: true },
});

module.exports = mongoose.model('TestCase', testcaseSchema);