"use strict";

var express = require('express');
var router = express.Router();
var submissionController = require('../controllers/submission-controllers/submissionController');
var authenticate = require('../middlewares/authenticate');
router.get('/', authenticate, submissionController.getAllSubmissions);
router.get('/user/:userId', authenticate, submissionController.getUserSubmissions);
router.get('/problem/:problemId', authenticate, submissionController.getProblemSubmissions);
router.get('/sheet/:sheetId', authenticate, submissionController.getSheetSubmissions);
router.get('/contest/:contestId', authenticate, submissionController.getContestSubmissions);
module.exports = router;