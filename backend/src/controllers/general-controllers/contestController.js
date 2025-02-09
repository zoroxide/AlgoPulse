const Contest = require("../../models/Contest");

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
      const contest = await Contest.findById(id).populate("problems");
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }
      res.json(contest);
    } catch (err) {
      res.status(500).json({ message: "Error fetching contest", error: err.message });
    }
  },

  getContestProblems: async (req, res) => {
    const { id } = req.params;
    try {
      const contest = await Contest.findById(id).populate("problems");
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }
      res.json(contest.problems);
    } catch (err) {
      res.status(500).json({ message: "Error fetching contest problems", error: err.message });
    }
  },
};