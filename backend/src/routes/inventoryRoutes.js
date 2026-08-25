const express = require("express");

const router = express.Router();

const {
  getInventory,
  getInventoryById,
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

router.get("/", getInventory);

router.get("/:id", getInventoryById);

router.post("/", addInventory);

router.put("/:id", updateInventory);

router.delete("/:id", deleteInventory);

module.exports = router;