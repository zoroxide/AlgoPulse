const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission-controllers/submissionController');

router.get('/user/:userId', submissionController.getUserSubmissions);
router.get('/problem/:problemId', submissionController.getProblemSubmissions);

module.exports = router;