const compilerController = require('../controllers/compiler-controllers/compilerController');
const express = require('express');
const router = express.Router();

router.post('/compile', compilerController.compileCode);

module.exports = router;