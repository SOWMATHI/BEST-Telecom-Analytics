const Employee = require("../models/Employee");

// Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("branch");

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
};