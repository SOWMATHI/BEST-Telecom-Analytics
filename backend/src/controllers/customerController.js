const Customer = require("../models/Customer");

// Get All Customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("branch");

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Customer
const addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  addCustomer,
};