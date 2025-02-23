const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission-controllers/submissionController');

router.post('/create', submissionController.createSubmission);
router.get('/user/:userId', submissionController.getUserSubmissions);
router.get('/problem/:problemId', submissionController.getProblemSubmissions); // New route

module.exports = router;