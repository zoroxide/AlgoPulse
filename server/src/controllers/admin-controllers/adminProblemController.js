const Problem = require("../../models/Problem");
const TestCase = require("../../models/TestCase");
const Sheet = require("../../models/Sheet");

exports.createProblem = async (req, res) => {
  try {
    const { name, description, difficulty, testcases } = req.body;

    if (!name || !description || !difficulty || !testcases) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Array.isArray(testcases) || !testcases.every((tc) => tc.input && tc.output)) {
      return res.status(400).json({ message: "Invalid testcases format." });
    }

    // Create test cases
    const createdTestCases = await TestCase.insertMany(testcases);

    // Create problem with references to test cases
    const newProblem = new Problem({
      name,
      description,
      difficulty,
      testcases: createdTestCases.map(tc => tc._id),
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create problem", error: err.message });
    console.error(err);
  }
};

exports.editProblem = async (req, res) => {
  const { id } = req.params;
  const { name, description, difficulty, testcases } = req.body;

  try {
    if (testcases) {
      if (!Array.isArray(testcases)) {
        return res.status(400).json({ message: "Testcases must be an array." });
      }
      for (const testcase of testcases) {
        if (!testcase.input || !testcase.output) {
          return res.status(400).json({ message: 'Each testcase must have "input" and "output".' });
        }
      }

      // Update test cases
      await Promise.all(testcases.map(async (tc) => {
        if (tc._id) {
          await TestCase.findByIdAndUpdate(tc._id, tc, { new: true, runValidators: true });
        } else {
          const newTestCase = new TestCase(tc);
          await newTestCase.save();
          tc._id = newTestCase._id;
        }
      }));
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { name, description, difficulty, testcases: testcases.map(tc => tc._id) },
      { new: true, runValidators: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({
      message: "Problem updated successfully!",
      problem: updatedProblem,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating problem", error: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting problem", error: err.message });
  }
};

exports.linkProblemsToSheet = async (req, res) => {
  const { sheetId, problemIds } = req.body;

  if (!sheetId || !problemIds || !Array.isArray(problemIds)) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found." });
    }

    const problems = await Problem.find({ _id: { $in: problemIds } });
    if (problems.length !== problemIds.length) {
      return res.status(404).json({ message: "One or more problems not found." });
    }

    sheet.problems = [...new Set([...sheet.problems, ...problemIds])];
    await sheet.save();

    res.status(200).json({
      message: "Problems linked to sheet successfully.",
      sheet,
    });
  } catch (error) {
    console.error("Error linking problems to sheet:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};