const Sheet = require("../../models/Sheet");
const Problem = require("../../models/Problem");

exports.createSheet = async (req, res) => {
  try {
    const { name, difficulty, content, img } = req.body;
    const newSheet = new Sheet({ name, difficulty, content, img });
    await newSheet.save();
    res.status(201).json(newSheet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create sheet", err });
    console.log(err);
  }
};

exports.linkProblemsToSheet = async (req, res) => {
  const { sheetId, problemIds } = req.body;

  if (!sheetId || !problemIds) {
    return res
      .status(400)
      .json({ message: "sheetId and problemIds are required." });
  }

  try {
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found." });
    }

    const problems = await Problem.find({ _id: { $in: problemIds } });
    if (problems.length !== problemIds.length) {
      return res
        .status(404)
        .json({ message: "One or more Problems not found." });
    }

    const uniqueProblemIds = [
      ...new Set([...sheet.problems.map((id) => id.toString()), ...problemIds]),
    ];
    sheet.problems = uniqueProblemIds;
    await sheet.save();

    res.status(200).json({ message: "Problems linked successfully.", sheet });
  } catch (err) {
    console.error("err linking problems:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.editSheet = async (req, res) => {
  const { id } = req.params;
  const { name, content, difficulty, img, problems } = req.body;

  try {
    const updatedSheet = await Sheet.findByIdAndUpdate(
      id,
      { name, content, difficulty, img, problems },
      { new: true, runValidators: true }
    );
    if (!updatedSheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    res.json(updatedSheet);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating sheet", error: err.message });
  }
};

exports.deleteSheet = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSheet = await Sheet.findByIdAndDelete(id);
    if (!deletedSheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    res.json({ message: "Sheet deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting sheet", error: err.message });
  }
};
