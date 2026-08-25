const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Branch = require("../models/Branch");
const Notification = require("../models/Notification");

// =============================
// GET ALL SALES
// =============================
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("customer")
      .populate("product")
      .populate("employee")
      .populate("branch");

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =============================
// CREATE SALE
// =============================
const addSale = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customer,
      product,
      employee,
      branch,
      quantity,
      sellingPrice,
      purchasePrice,
      discount = 0,
      gst = 18,
      paymentMethod,
    } = req.body;

    // =============================
    // CHECK INVENTORY
    // =============================
    const inventory = await Inventory.findOne({
      product,
      branch,
    });

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found",
      });
    }

    // =============================
    // CHECK STOCK
    // =============================
    if (inventory.currentStock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock available",
      });
    }

    // =============================
    // CALCULATIONS
    // =============================
    const totalAmount = quantity * sellingPrice - discount;

    const profit =
      (sellingPrice - purchasePrice) * quantity - discount;

    // =============================
    // SAVE SALE
    // =============================
    const sale = await Sale.create({
      invoiceNumber,
      customer,
      product,
      employee,
      branch,
      quantity,
      sellingPrice,
      purchasePrice,
      discount,
      gst,
      paymentMethod,
      totalAmount,
      profit,
    });

    // =============================
    // UPDATE INVENTORY
    // =============================
    inventory.currentStock -= quantity;
    await inventory.save();

    // =============================
    // UPDATE PRODUCT
    // =============================
    await Product.findByIdAndUpdate(product, {
      $inc: {
        stock: -quantity,
        totalSold: quantity,
        totalRevenue: totalAmount,
        totalProfit: profit,
      },
    });

    // =============================
    // UPDATE CUSTOMER
    // =============================
    await Customer.findByIdAndUpdate(customer, {
      $inc: {
        loyaltyPoints: quantity,
        totalPurchaseAmount: totalAmount,
        totalOrders: 1,
      },
      lastPurchaseDate: new Date(),
    });

    // =============================
    // UPDATE EMPLOYEE
    // =============================
    await Employee.findByIdAndUpdate(employee, {
      $inc: {
        monthlySales: totalAmount,
      },
    });

    // =============================
    // UPDATE BRANCH
    // =============================
    await Branch.findByIdAndUpdate(branch, {
      $inc: {
        totalRevenue: totalAmount,
        totalProfit: profit,
        totalSales: 1,
      },
    });

    // =============================
    // LOW STOCK NOTIFICATION
    // =============================
    if (inventory.currentStock <= inventory.minimumStock) {
      await Notification.create({
        title: "Low Stock Alert",
        message: "Product stock is below minimum level.",
        type: "Low Stock",
        priority: "High",
      });
    }

    // =============================
    // RESPONSE
    // =============================
    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSales,
  addSale,
};