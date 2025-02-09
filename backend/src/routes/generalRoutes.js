const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/user-controller/userController');
const sheetController = require('../controllers/general-controllers/sheetController');
const problemController = require('../controllers/general-controllers/problemController');
const contestController = require('../controllers/general-controllers/contestController');

router.get('/get-user', authenticate, userController.getUser);

// ==================== "Users" Public Operations ====================
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/:userId/solved-problems', userController.getSolvedProblems);

// ==================== "Sheets" Public Operations ===================
router.get('/sheets', sheetController.getAllSheets);
router.get('/sheets/:id', sheetController.getSheetById);
router.get('/sheets/:id/problems', sheetController.getSheetProblems);

// ==================== "Problems" Public Operations =================
router.get('/problems', problemController.getAllProblems);
router.get('/problems/:id', problemController.getProblemById);

// ==================== "Contests" Public Operations =================
router.get('/contests', contestController.getAllContests);
router.get('/contests/:id', contestController.getContestById);
router.get('/contests/:id/problems', contestController.getContestProblems);

module.exports = router;