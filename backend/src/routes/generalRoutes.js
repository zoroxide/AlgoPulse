const express = require('express');
const router = express.Router();
const Sheet = require('../models/Sheet');
const Problem = require('../models/Problem');
const Contest = require('../models/Contest');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');

router.get('/get-user', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: `internal server error, ${err}`});
  }
});


// ==================== Users Public Operations ====================

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Fetch a single user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// ==================== Sheets CRUD Operations ====================

// Fetch all sheets
router.get('/sheets', async (req, res) => {
  
  try {
    const sheets = await Sheet.find().populate('problems');
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sheets', error: err.message });
  }
});

// Fetch a single sheet by ID
router.get('/sheets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sheet = await Sheet.findById(id).populate('problems');
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sheet', error: err.message });
  }
});

// ==================== Problems CRUD Operations ====================

// Fetch all problems
router.get('/problems', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problems', error: err.message });
  }
});

// Fetch a single problem by ID
router.get('/problems/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem', error: err.message });
  }
});

// ==================== Contests Public Operations ====================

// Fetch all contests
router.get('/contests', async (req, res) => {
  try {
    const contests = await Contest.find();
    res.json(contests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contests', error: err.message });
  }
});

// Fetch a single contest by ID
router.get('/contests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json(contest);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contest', error: err.message });
  }
});

module.exports = router;