"use strict";

var jwt = require('jsonwebtoken');
var generateToken = function generateToken(user) {
  return jwt.sign({
    id: user._id,
    isAdmin: user.isAdmin
  }, process.env.JWT_SECRET, {
    expiresIn: '6h'
  });
};
var verifyToken = function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Token is invalid or expired');
  }
};
module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken
};