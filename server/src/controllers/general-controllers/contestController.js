const mongoose = require("mongoose");
const Contest = require("../../models/Contest");
const Submission = require("../../models/Submission");
const User = require("../../models/User");

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
      if (!contestId || !problemId) {
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
      const contest = await Contest.findById(id).populate({
        path: 'submissions',
        populate: [
          { path: 'user', model: 'User' },
          { path: 'problem', model: 'Problem' }
        ]
      });

      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      // Filter accepted submissions
      const acceptedSubmissions = contest.submissions.filter(submission => submission.status === "Accepted");

      // Group submissions by user and sort by time
      const userSubmissions = acceptedSubmissions.reduce((acc, submission) => {
        const userId = submission.user._id.toString();
        if (!acc[userId]) {
          acc[userId] = { user: submission.user, submissions: [] };
        }
        acc[userId].submissions.push(submission);
        return acc;
      }, {});

      // Sort users by the earliest submission time
      const sortedUsers = Object.values(userSubmissions).sort((a, b) => {
        const aEarliestTime = Math.min(...a.submissions.map(sub => new Date(sub.time).getTime()));
        const bEarliestTime = Math.min(...b.submissions.map(sub => new Date(sub.time).getTime()));
        return aEarliestTime - bEarliestTime;
      });

      // Format the leaderboard
      const leaderboard = sortedUsers.map(userSub => ({
        user: userSub.user,
        problemsSolved: userSub.submissions.length,
        earliestSubmissionTime: new Date(Math.min(...userSub.submissions.map(sub => new Date(sub.time).getTime())))
      }));

      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
    }
  },
};