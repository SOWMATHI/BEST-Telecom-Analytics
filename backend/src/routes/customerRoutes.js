const express = require("express");

const router = express.Router();

const {
  getCustomers,
  addCustomer,
} = require("../controllers/customerController");

router.get("/", getCustomers);

router.post("/", addCustomer);

module.exports = router;