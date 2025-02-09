const express = require("express");
const router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin");
const adminSheetController = require("../controllers/admin-controllers/adminSheetController");
const adminContestController = require('../controllers/admin-controllers/adminContestController');
const adminProblemController = require("../controllers/admin-controllers/adminProblemController");
const adminUserController = require("../controllers/admin-controllers/adminUserController");

// "Sheet" Admin operations
router.post("/sheet/create", checkAdmin, adminSheetController.createSheet);
router.post('/sheet/link', checkAdmin, adminSheetController.linkProblemsToSheet);
router.put('/sheet/edit/:id', checkAdmin, adminSheetController.editSheet);
router.delete('/sheet/delete/:id', checkAdmin, adminSheetController.deleteSheet);

// "Contest" Admin operations
router.post('/contest/create', checkAdmin, adminContestController.createContest);
router.post('/contest/link', checkAdmin, adminContestController.linkProblemsToContest);
router.put('/contest/edit/:id', checkAdmin, adminContestController.editContest);
router.delete('/contest/delete/:id', checkAdmin, adminContestController.deleteContest);

// "Problem" Admin operations
router.post("/problem/create", checkAdmin, adminProblemController.createProblem);
router.put('/problem/edit/:id', checkAdmin, adminProblemController.editProblem);
router.delete('/problem/delete/:id', checkAdmin, adminProblemController.deleteProblem);
router.post('/problem/link', checkAdmin, adminProblemController.linkProblemsToSheet);

// "User" Admin operations
router.delete('/user/delete/:id', checkAdmin, adminUserController.deleteUser);
router.put('/user/make-admin/:id', checkAdmin, adminUserController.makeAdmin);

module.exports = router;