const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Employee = require("../models/Employee");
const Customer = require("../models/Customer");
const Branch = require("../models/Branch");
const Inventory = require("../models/Inventory");

const getDashboard = async (req, res) => {
  try {

    // ======================
    // DATES
    // ======================

    const now = new Date();

    const today = new Date(now);
    today.setHours(0,0,0,0);

    const week = new Date(now);
    week.setDate(now.getDate()-7);

    const month = new Date(now);
    month.setMonth(now.getMonth()-1);

    const year = new Date(now);
    year.setFullYear(now.getFullYear()-1);

    // ======================
    // SUMMARY
    // ======================

    const totalProducts = await Product.countDocuments();

    const totalCustomers = await Customer.countDocuments();

    const totalEmployees = await Employee.countDocuments();

    const totalBranches = await Branch.countDocuments();

    const totalSales = await Sale.countDocuments();

    // ======================
    // SALES
    // ======================

    const allSales = await Sale.find();

    const totalRevenue = allSales.reduce(
      (sum,s)=>sum+s.totalAmount,
      0
    );

    const totalProfit = allSales.reduce(
      (sum,s)=>sum+s.profit,
      0
    );

    // ======================
    // TODAY
    // ======================

    const todaySales = await Sale.find({
      createdAt:{$gte:today}
    });

    const todayRevenue = todaySales.reduce(
      (sum,s)=>sum+s.totalAmount,
      0
    );

    // ======================
    // WEEK
    // ======================

    const weeklySales = await Sale.find({
      createdAt:{$gte:week}
    });

    const weeklyRevenue = weeklySales.reduce(
      (sum,s)=>sum+s.totalAmount,
      0
    );

    // ======================
    // MONTH
    // ======================

    const monthlySales = await Sale.find({
      createdAt:{$gte:month}
    });

    const monthlyRevenue = monthlySales.reduce(
      (sum,s)=>sum+s.totalAmount,
      0
    );

    // ======================
    // YEAR
    // ======================

    const yearlySales = await Sale.find({
      createdAt:{$gte:year}
    });

    const yearlyRevenue = yearlySales.reduce(
      (sum,s)=>sum+s.totalAmount,
      0
    );

    // ======================
    // PRODUCTS
    // ======================

    const topProducts = await Product.find()
      .sort({totalSold:-1})
      .limit(5);

    const lowStockProducts = await Inventory.find({
      $expr:{
        $lte:["$currentStock","$minimumStock"]
      }
    }).populate("product");

    // ======================
    // EMPLOYEE
    // ======================

    const topEmployees = await Employee.find()
      .sort({monthlySales:-1})
      .limit(5);

    // ======================
    // CUSTOMER
    // ======================

    const topCustomers = await Customer.find()
      .sort({totalPurchaseAmount:-1})
      .limit(5);

    // ======================
    // BRANCH
    // ======================

    const topBranches = await Branch.find()
      .sort({totalRevenue:-1});

    // ======================
    // RESPONSE
    // ======================

    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("customer")
      .populate("product")
      .populate("employee")
      .populate("branch");

    res.status(200).json({
      summary: {
        totalProducts,
        totalCustomers,
        totalEmployees,
        totalBranches,
        totalSales,
        totalRevenue,
        totalProfit,
      },

      // frontend expects these exact keys
      salesWidgets: {
        today: todayRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue,
        yearly: yearlyRevenue,
      },

      topProducts,
      topEmployees,
      topCustomers,
      topBranches,

      // frontend passes `dashboard.lowStock` into <LowStock data={...} />
      lowStock: lowStockProducts,

      // frontend passes `dashboard.recentSales` into <RecentSales data={...} />
      recentSales,

      // backward compatible payloads (may be used by older UI)
      today: { sales: todaySales.length, revenue: todayRevenue },
      weekly: { sales: weeklySales.length, revenue: weeklyRevenue },
      monthly: { sales: monthlySales.length, revenue: monthlyRevenue },
      yearly: { sales: yearlySales.length, revenue: yearlyRevenue },

      // keep original key too
      lowStockProducts,
    });

  }
  catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};
const getMonthlySalesChart = async (req, res) => {

    try {

        const result = await Sale.aggregate([

            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }
                    },

                    totalRevenue: {
                        $sum: "$totalAmount"
                    },

                    totalSales: {
                        $sum: 1
                    }

                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }

        ]);

        res.status(200).json(result);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
  getDashboard,
  getMonthlySalesChart
};