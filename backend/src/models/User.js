const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cf_handle: String,
  phone: String,
  score: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String },
  solved_problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
