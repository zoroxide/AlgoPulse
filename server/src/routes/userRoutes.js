const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/user-controller/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authenticate, userController.logout);
router.get('/leaderboard', authenticate, userController.getTopUsersByScore);

module.exports = router;