const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  difficulty: { type: String, required: true },
  img: String,
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sheet', sheetSchema);
