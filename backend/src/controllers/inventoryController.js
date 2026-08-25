const Inventory = require("../models/Inventory");

// Get All Inventory
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("product")
      .populate("branch");

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Inventory
const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate("product")
      .populate("branch");

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
      });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Inventory
const addInventory = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);

    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Inventory
const updateInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
      });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Inventory
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
      });
    }

    res.status(200).json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  addInventory,
  updateInventory,
  deleteInventory,
};