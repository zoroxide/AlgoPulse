const Submission = require('../../models/Submission');
const User = require('../../models/User');
const Sheet = require('../../models/Sheet');
const Contest = require('../../models/Contest');

module.exports = {
  getUserSubmissions: async (req, res) => {
    const { userId } = req.params;
    try {
      const submissions = await Submission.find({ user: userId }).populate('problem');
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
      console.log(err);
    }
  },

  getProblemSubmissions: async (req, res) => {
    const { problemId } = req.params;
    try {
      const submissions = await Submission.find({ problem: problemId }).populate('user');
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
      console.log(err);
    }
  },

  getSheetSubmissions: async (req, res) => {
    const { sheetId } = req.params;
    try {
      const sheet = await Sheet.findById(sheetId).populate('problems');
      if (!sheet) {
        return res.status(404).json({ message: 'Sheet not found' });
      }

      const problemIds = sheet.problems.map(problem => problem._id);
      const submissions = await Submission.find({ problem: { $in: problemIds } }).populate('user problem');
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
      console.log(err);
    }
  },

  getContestSubmissions: async (req, res) => {
    const { contestId } = req.params;
    try {
      const contest = await Contest.findById(contestId).populate('problems');
      if (!contest) {
        return res.status(404).json({ message: 'Contest not found' });
      }

      const problemIds = contest.problems.map(problem => problem._id);
      const submissions = await Submission.find({ problem: { $in: problemIds } }).populate('user problem');
      res.json(submissions);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
      console.log(err);
    }
  }
};