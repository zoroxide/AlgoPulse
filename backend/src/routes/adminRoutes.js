const express = require("express");
const router = express.Router();
const Sheet = require("../models/Sheet");
const Problem = require("../models/Problem");
const Contest = require("../models/Contest");
const  checkAdmin  = require("../middlewares/checkAdmin");


// Sheet CUD operations
router.post("/sheet/create", checkAdmin, async (req, res) => {
  try {
    const { name, difficulty, content, img } = req.body;
    const newSheet = new Sheet({ name, difficulty, content, img });
    await newSheet.save();
    res.status(201).json(newSheet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create sheet", err });
    console.log(err);
  }
});

router.post('/sheet/link', checkAdmin, async (req, res) => {
  const { sheetId, problemIds } = req.body;

  if (!sheetId || !problemIds) {
    return res.status(400).json({ message: 'sheetId and problemIds are required.' });
  }

  try {
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found.' });
    }

    const problems = await Problem.find({ _id: { $in: problemIds } });
    if (problems.length !== problemIds.length) {
      return res.status(404).json({ message: 'One or more Problems not found.' });
    }

    const uniqueProblemIds = [...new Set([...sheet.problems.map(id => id.toString()), ...problemIds])];
    sheet.problems = uniqueProblemIds;
    await sheet.save();

    res.status(200).json({ message: 'Problems linked successfully.', sheet });
  } catch (err) {
    console.error('err linking problems:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/sheet/edit/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, content, difficulty, img, problems } = req.body;

  try {
    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      { name, content, difficulty, img, problems },
      { new: true, runValidators: true }
    );
    if (!updatedSheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    res.json(updatedSheet);
  } catch (err) {
    res.status(500).json({ message: 'Error updating sheet', error: err.message });
  }
});

router.delete('/sheet/delete/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSheet = await Sheet.findByIdAndDelete(id);
    if (!deletedSheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }
    res.json({ message: 'Sheet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting sheet', error: err.message });
  }
});

// Contest CUD operations
router.post("/contest/create", checkAdmin, async (req, res) => {
  try {
    const { name, difficulty, description, startTime, endTime, problems, solvedProblems } = req.body;

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: "End time must be after the start time" });
    }

    const newContest = new Contest({ name, difficulty, description, startTime, endTime, problems, solvedProblems });
    await newContest.save();
    res.status(201).json({ message: "Contest created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create contest", err });
    console.log(err);
  }
});

router.put('/contest/edit/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, difficulty, description, startTime, endTime, problems, solvedProblems } = req.body;

  try {
    const updatedContest = await Contest.findByIdAndUpdate(
      id,
      { name, difficulty, description, startTime, endTime, problems, solvedProblems },
      { new: true, runValidators: true }
    );
    if (!updatedContest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json(updatedContest);
  } catch (err) {
    res.status(500).json({ message: 'Error updating contest', error: err.message });
  }
});

router.delete('/contest/delete/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContest = await Contest.findByIdAndDelete(id);
    if (!deletedContest) {
      return res.status(404).json({ message: 'Contest not found' });
    }
    res.json({ message: 'Contest deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting contest', error: err.message });
  }
});

router.post('/contest/link', async (req, res) => {
  const { contestId, problemIds } = req.body;
  console.log("Received contestId:", contestId);
  console.log("Received problemIds:", problemIds);

  console.log("Received contestId:", contestId);
  console.log("Received problemIds:", problemIds);

  // if (!contestId || !problemIds || !Array.isArray(problemIds)) {
  //     console.log("Invalid request data. Ensure all fields are provided.");
  //     return res.status(400).json({ message: 'Invalid request data. Ensure all fields are provided.' });
  // }

  try {
      const contest = await Contest.findById(contestId);
      if (!contest) {
          console.log("Contest not found");
          return res.status(404).json({ message: 'Contest not found.' });
      }

      const existingProblems = await Problem.find({ _id: { $in: problemIds } });
      if (existingProblems.length !== problemIds.length) {
          console.log("One or more problems not found.");
          return res.status(404).json({ message: 'One or more problems not found.' });
      }

      // Avoid duplicates
      contest.problems = [...new Set([...contest.problems, ...problemIds])];
      await contest.save();

      res.status(200).json({
          message: 'Problems linked to contest successfully.',
          contest,
      });
  } catch (error) {
      console.error('Error linking problems to contest:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});



// Problem CUD operations
router.post("/problem/create", checkAdmin, async (req, res) => {
  try {
    const { name, description, difficulty, testcases } = req.body;

    if (!name || !description || !difficulty || !testcases) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Array.isArray(testcases) || !testcases.every(tc => tc.inputs && tc.outputs)) {
      return res.status(400).json({ message: "Invalid testcases format." });
    }

    const newProblem = new Problem({
      name,
      description,
      difficulty,
      testcases,
    });

    await newProblem.save();
    res.status(201).json({ "Message": "Problem created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create problem", error: err.message });
    console.error(err);
  }
});

router.put('/problem/edit/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, difficulty, testcases } = req.body;

  try {
    if (testcases) {
      if (!Array.isArray(testcases)) {
        return res.status(400).json({ message: 'Testcases must be an array.' });
      }
      for (const testcase of testcases) {
        if (!Array.isArray(testcase.inputs) || !Array.isArray(testcase.outputs)) {
          return res.status(400).json({ message: 'Each testcase must have "inputs" and "outputs" as arrays.' });
        }
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { name, description, difficulty, testcases },
      { new: true, runValidators: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem updated successfully!', problem: updatedProblem });
  } catch (err) {
    res.status(500).json({ message: 'Error updating problem', error: err.message });
  }
});

router.delete('/problem/delete/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting problem', error: err.message });
  }
});

router.post('/problem/link', checkAdmin, async (req, res) => {
  const { sheetId, problemIds } = req.body;

  if (!sheetId || !problemIds || !Array.isArray(problemIds)) {
      return res.status(400).json({ message: 'Invalid input data.' });
  }

  try {
      // Validate if the sheet exists
      const sheet = await Sheet.findById(sheetId);
      if (!sheet) {
          return res.status(404).json({ message: 'Sheet not found.' });
      }

      // Validate if all provided problems exist
      const problems = await Problem.find({ _id: { $in: problemIds } });
      if (problems.length !== problemIds.length) {
          return res.status(404).json({ message: 'One or more problems not found.' });
      }

      // Link the problems to the sheet
      sheet.problems = [...new Set([...sheet.problems, ...problemIds])]; // Avoid duplicates
      await sheet.save();

      res.status(200).json({
          message: 'Problems linked to sheet successfully.',
          sheet,
      });
  } catch (error) {
      console.error('Error linking problems to sheet:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});


// delete a user by ID
router.delete('/user/delete/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});


// Make a user an admin by ID
router.put('/user/make-admin/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAdmin: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User promoted to admin successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error promoting user to admin', error: err.message });
  }
});

module.exports = router;