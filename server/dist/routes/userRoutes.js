"use strict";

var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
var userController = require('../controllers/user-controller/userController');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authenticate, userController.logout);
router.get('/leaderboard', authenticate, userController.getTopUsersByScore);
module.exports = router;