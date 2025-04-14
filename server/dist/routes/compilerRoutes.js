"use strict";

var compilerController = require('../controllers/compiler-controllers/compilerController');
var authenticate = require('../middlewares/authenticate');
var express = require('express');
var router = express.Router();
router.post('/sheet', authenticate, compilerController.compileSheetCode);
router.post('/contest', authenticate, compilerController.compileContestCode);
module.exports = router;