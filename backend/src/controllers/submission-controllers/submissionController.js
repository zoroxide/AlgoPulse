const Submission = require('../../models/Submission');

module.exports = {
  createSubmission: async (req, res) => {
    const { user, problem, time, code, accepted, failedTestcase } = req.body;
    try {
      const newSubmission = new Submission({
        user,
        problem,
        time,
        code,
        accepted,
        failedTestcase,
      });
      await newSubmission.save();
      res.status(201).json(newSubmission);
    } catch (err) {
      res.status(500).json({ message: 'Error creating submission', error: err.message });
      console.log(err);
    }
  },

  getUserSubmissions: async (req, res) => {
    const { userId } = req.params;
    try {
      const submissions = await Submission.find({ user: userId }).populate('problem');
      res.json(submissions);
    } catch (err) {
        console.log(err);
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
    }
  },

  getProblemSubmissions: async (req, res) => {
    const { problemId } = req.params;
    try {
      const submissions = await Submission.find({ problem: problemId }).populate('user');
      res.json(submissions);
    } catch (err) {
        console.log(err);
      res.status(500).json({ message: 'Error fetching submissions', error: err.message });
    }
  },
};