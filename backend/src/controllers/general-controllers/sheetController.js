const Sheet = require("../../models/Sheet");

module.exports = {
  getAllSheets: async (req, res) => {
    try {
      const sheets = await Sheet.find().populate("problems");
      res.json(sheets);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching sheets", error: err.message });
    }
  },

  getSheetById: async (req, res) => {
    const { id } = req.params;
    try {
      const sheet = await Sheet.findById(id).populate("problems");
      if (!sheet) {
        return res.status(404).json({ message: "Sheet not found" });
      }
      res.json(sheet);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching sheet", error: err.message });
    }
  },
};
