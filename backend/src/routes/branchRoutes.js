const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getMonthlySalesChart,
} = require("../controllers/dashboardController");

router.get("/", getDashboard);

router.get("/monthly-chart", getMonthlySalesChart);

module.exports = router;