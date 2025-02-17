const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cf_handle: { type: String, required: true },
  phone: { type: String, required: true },
  score: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String, required: true },
  solved_problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true }],
  createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('User', userSchema);
