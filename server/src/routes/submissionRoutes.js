const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission-controllers/submissionController');
const authenticate = require('../middlewares/authenticate');

router.get('/user/:userId',authenticate, submissionController.getUserSubmissions);
router.get('/problem/:problemId', authenticate, submissionController.getProblemSubmissions);
router.get('/contest/:contestId', authenticate, submissionController.getSheetSubmissions);
router.get('/sheet/:contestId', authenticate, submissionController.getContestSubmissions);

module.exports = router;