const Problem = require('../../models/Problem');

module.exports = {
  getAllProblems: async (req, res) => {
    try {
      const problems = await Problem.find();
      res.json(problems);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching problems', error: err.message });
    }
  },

  getProblemById: async (req, res) => {
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
  },
};