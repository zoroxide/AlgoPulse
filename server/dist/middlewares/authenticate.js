"use strict";

var jwt = require('jsonwebtoken');
var authenticate = function authenticate(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized: No token provided {MID}'
    });
  }
  var token = authHeader.split(' ')[1];
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid token'
    });
  }
};
module.exports = authenticate;