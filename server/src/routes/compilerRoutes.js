const compilerController = require('../controllers/compiler-controllers/compilerController');
const authenticate = require('../middlewares/authenticate');
const express = require('express');
const router = express.Router();

router.post('/sheet', authenticate , compilerController.compileSheetCode);
router.post('/contest', authenticate , compilerController.compileContestCode);

module.exports = router;