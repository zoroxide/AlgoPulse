const Contest = require("../../models/Contest");
const Problem = require("../../models/Problem");

exports.createContest = async (req, res) => {
  try {
    const {
      name,
      difficulty,
      description,
      startTime,
      endTime,
      problems,
    } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after the start time" });
    }

    const newContest = new Contest({
      name,
      difficulty,
      description,
      startTime,
      endTime,
      problems,
    });
    await newContest.save();
    res.status(201).json({ message: "Contest created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create contest", err });
    console.log(err);
  }
};

exports.editContest = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    difficulty,
    description,
    startTime,
    endTime,
    problems,
    solvedProblems,
  } = req.body;

  try {
    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      {
        name,
        difficulty,
        description,
        startTime,
        endTime,
        problems,
        solvedProblems,
      },
      { new: true, runValidators: true }
    );
    if (!updatedContest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(updatedContest);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating contest", error: err.message });
  }
};

exports.deleteContest = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContest = await Contest.findByIdAndDelete(id);
    if (!deletedContest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json({ message: "Contest deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting contest", error: err.message });
  }
};

exports.linkProblemsToContest = async (req, res) => {
  const { contestId, problemIds } = req.body;

  if (!contestId || !problemIds || !Array.isArray(problemIds)) {
    return res
      .status(400)
      .json({
        message: "Invalid request data. Ensure all fields are provided.",
      });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found." });
    }

    const existingProblems = await Problem.find({ _id: { $in: problemIds } });
    if (existingProblems.length !== problemIds.length) {
      return res
        .status(404)
        .json({ message: "One or more problems not found." });
    }

    contest.problems = [...new Set([...contest.problems, ...problemIds])];
    await contest.save();

    res.status(200).json({
      message: "Problems linked to contest successfully.",
      contest,
    });
  } catch (error) {
    console.error("Error linking problems to contest:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
