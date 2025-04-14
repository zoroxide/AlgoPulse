"use strict";

var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
var userController = require('../controllers/user-controller/userController');
var sheetController = require('../controllers/general-controllers/sheetController');
var problemController = require('../controllers/general-controllers/problemController');
var contestController = require('../controllers/general-controllers/contestController');
var blogController = require("../controllers/general-controllers/blogController");
var adminBlogController = require("../controllers/admin-controllers/adminBlogController");
router.get('/get-user', authenticate, userController.getUser);

// ==================== "Users" Public Operations ====================
router.get('/users', authenticate, userController.getAllUsers);
router.get('/users/:id', authenticate, userController.getUserById);
router.get('/users/:userId/solved-problems', authenticate, userController.getSolvedProblems);

// ==================== "Sheets" Public Operations ===================
router.get('/sheets', authenticate, sheetController.getAllSheets);
router.get('/sheets/:id', authenticate, sheetController.getSheetById);
router.get('/sheets/:id/problems', authenticate, sheetController.getSheetProblems);

// ==================== "Problems" Public Operations =================
router.get('/problems/stats', authenticate, problemController.getProblemStats);
router.get('/problems', authenticate, problemController.getAllProblems);
router.get('/problems/:id', authenticate, problemController.getProblemById);
router.post('/problems/details', authenticate, problemController.getProblemDetails);

// ==================== "Contests" Public Operations =================
router.get('/contests', authenticate, contestController.getAllContests);
router.get('/contests/:id', authenticate, contestController.getContestById);
router.get('/contests/:id/problems', authenticate, contestController.getContestProblems);
router.get('/contests/:contestId/problem/:problemId', authenticate, contestController.getProblemFromContest);
router.get('/contests/leaderboard/:id', authenticate, contestController.getContestLeaderboard);

// ==================== "Blog" Public Operations =================
router.get('/blogs', authenticate, blogController.getAllBlogs);
router.get('/blogs/:id', authenticate, blogController.getBlogById);
router.post('/blogs/:id/upvote', authenticate, blogController.upvoteBlog);
router.post('/blogs/:id/downvote', authenticate, blogController.downvoteBlog);
module.exports = router;