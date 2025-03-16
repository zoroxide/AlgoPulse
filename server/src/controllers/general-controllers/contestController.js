const mongoose = require("mongoose");
const Contest = require("../../models/Contest");
const Submission = require("../../models/Submission");

module.exports = {
  getAllContests: async (req, res) => {
    try {
      const contests = await Contest.find();
      res.json(contests);
    } catch (err) {
      res.status(500).json({ message: "Error fetching contests", error: err.message });
    }
  },

  getContestById: async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid contest ID" });
      }

      const contest = await Contest.findById(id).populate("problems");
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      res.json(contest);
    } catch (err) {
      res.status(500).json({ message: "Error fetching contest", error: err.message });
    }
  },

  getProblemFromContest: async (req, res) => {
    const { contestId, problemId } = req.params;
    try {

      if(!contestId || !problemId) {
        return res.status(400).json({ message: "Invalid contest or problem ID" });
      }

      const contest = await Contest.findById(contestId).populate("problems");
      
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      const problem = contest.problems.find((problem) => problem._id.toString() === problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found in contest" });
      }

      res.json(problem);
    } catch (err) {
      res.status(500).json({ message: "Error fetching problem from contest", error: err.message });
    }
  },

  getContestProblems: async (req, res) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid contest ID" });
      }

      const contest = await Contest.findById(id).populate("problems");
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      res.json(contest.problems);
    } catch (err) {
      res.status(500).json({ message: "Error fetching contest problems", error: err.message });
    }
  },

  getContestLeaderboard: async (req, res) => {
    const { id } = req.params;
    try {
      const submissions = await Submission.find({ contest: id, status: "Accepted" }).populate("user");
      // console.log(submissions);
      const leaderboard = submissions.reduce((acc, submission) => {
        const userId = submission.user._id.toString();
        if (!acc[userId]) {
          acc[userId] = { user: submission.user, problemsSolved: 0 };
        }
        acc[userId].problemsSolved += 1;
        return acc;
      }, {});

      const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.problemsSolved - a.problemsSolved);
      res.json(sortedLeaderboard);
    } catch (err) {
      res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
    }
  },
};