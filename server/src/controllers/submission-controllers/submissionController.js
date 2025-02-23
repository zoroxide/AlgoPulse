const Submission = require('../../models/Submission');
const User = require('../../models/User');

module.exports = {
  createSubmission: async (req, res) => {
    const { user, problem, time, code, accepted, failedTestcase } = req.body;
    try {
      // Check if the user has already solved the problem
      const existingSubmission = await Submission.findOne({ user, problem, accepted: true });

      if (!existingSubmission) {
        // Increment the user's score if this is the first accepted submission for the problem
        if (accepted) {
          await User.findByIdAndUpdate(user, { $inc: { score: 1 }, $addToSet: { solved_problems: problem } });
        }
      }

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