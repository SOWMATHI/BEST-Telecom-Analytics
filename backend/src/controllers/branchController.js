const Branch = require("../models/Branch");

// Get All Branches
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();

    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Branch
const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getBranches,
  addBranch,
};