const Submission = require('../../models/Submission');
const User = require('../../models/User');

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
};