const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cf_handle: String,
  phone: String,
  isAdmin: { type: Boolean, default: false },
  avatar: { type: String },
  solved_problems: [String]
});

module.exports = mongoose.model('User', userSchema);
