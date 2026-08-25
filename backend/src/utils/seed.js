/*
  Seed script for BEST Telecom Analytics (demo data for Dashboard)
  - Creates: Branches (Coimbatore, Tirupur)
             Employees, Customers, Products, Inventory
             Sales across last months (for KPIs + charts)

  Usage:
    cd backend
    npm run seed

  Requirements:
    MONGODB_URI in environment (or in .env next to server.js)
*/
require("dotenv").config();

const mongoose = require("mongoose");

const Branch = require("../models/Branch");
const Employee = require("../models/Employee");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Sale = require("../models/Sale");
const Notification = require("../models/Notification");

const pad = (n) => String(n).padStart(2, "0");

const daysAgo = (d) => {
  const x = new Date();
  x.setDate(x.getDate() - d);
  return x;
};

const monthsAgo = (m) => {
  const x = new Date();
  x.setMonth(x.getMonth() - m);
  return x;
};

const invoices = (prefix, count) => {
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date();
    return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(i + 1)}`;
  });
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI not set. Add it to backend/.env or environment variables.");
  }

  await mongoose.connect(uri);

  // Reset: clear collections (order matters for refs)
  // Note: keep it simple; if collections don't exist, deleteMany is harmless.
  await Promise.all([
    Notification.deleteMany({}),
    Sale.deleteMany({}),
    Inventory.deleteMany({}),
    Product.deleteMany({}),
    Customer.deleteMany({}),
    Employee.deleteMany({}),
    Branch.deleteMany({}),
  ]);

  // -----------------
  // Branches
  // -----------------
  const branches = await Branch.insertMany([
    {
      branchName: "Coimbatore",
      branchCode: "CBR-001",
      city: "Coimbatore",
      address: "Coimbatore Main Road",
      phone: "+91-9000011111",
      email: "coimbatore@besttelecom.com",
      managerName: "R. Kannan",
      status: "Active",
    },
    {
      branchName: "Tirupur",
      branchCode: "TPR-001",
      city: "Tirupur",
      address: "Tirupur Dharapuram Road",
      phone: "+91-9000022222",
      email: "tirupur@besttelecom.com",
      managerName: "S. Prakash",
      status: "Active",
    },
  ]);

  // -----------------
  // Employees (each branch)
  // -----------------
  const employees = await Employee.insertMany([
    {
      employeeId: "EMP-CB-001",
      fullName: "A. Mahesh",
      email: "a.mahesh@besttelecom.com",
      phone: "+91-9876501234",
      gender: "Male",
      designation: "Sales Executive",
      branch: branches[0]._id,
      salary: 25000,
      monthlyTarget: 800000,
      totalSalesCount: 0,
      totalRevenue: 0,
      totalProfit: 0,
      performanceRating: 4,
      joiningDate: monthsAgo(14),
      status: "Active",
    },
    {
      employeeId: "EMP-CB-002",
      fullName: "M. Suresh",
      email: "m.suresh@besttelecom.com",
      phone: "+91-9876505678",
      gender: "Male",
      designation: "Cashier",
      branch: branches[0]._id,
      salary: 22000,
      monthlyTarget: 0,
      joiningDate: monthsAgo(20),
      status: "Active",
    },
    {
      employeeId: "EMP-CB-003",
      fullName: "N. Divya",
      email: "n.divya@besttelecom.com",
      phone: "+91-9876509012",
      gender: "Female",
      designation: "Inventory Manager",
      branch: branches[0]._id,
      salary: 30000,
      monthlyTarget: 0,
      joiningDate: monthsAgo(10),
      status: "Active",
    },

    {
      employeeId: "EMP-TP-001",
      fullName: "K. Saravanan",
      email: "k.saravanan@besttelecom.com",
      phone: "+91-9876511111",
      gender: "Male",
      designation: "Sales Executive",
      branch: branches[1]._id,
      salary: 24000,
      monthlyTarget: 750000,
      joiningDate: monthsAgo(12),
      status: "Active",
    },
    {
      employeeId: "EMP-TP-002",
      fullName: "P. Priya",
      email: "p.priya@besttelecom.com",
      phone: "+91-9876512222",
      gender: "Female",
      designation: "Cashier",
      branch: branches[1]._id,
      salary: 21500,
      monthlyTarget: 0,
      joiningDate: monthsAgo(18),
      status: "Active",
    },
    {
      employeeId: "EMP-TP-003",
      fullName: "V. Aravind",
      email: "v.aravind@besttelecom.com",
      phone: "+91-9876513333",
      gender: "Male",
      designation: "Store Manager",
      branch: branches[1]._id,
      salary: 38000,
      monthlyTarget: 1000000,
      joiningDate: monthsAgo(24),
      status: "Active",
    },
  ]);

  const employeeByBranch = {
    [branches[0]._id.toString()]: employees.filter((e) => String(e.branch) === String(branches[0]._id)),
    [branches[1]._id.toString()]: employees.filter((e) => String(e.branch) === String(branches[1]._id)),
  };

  // -----------------
  // Customers
  // -----------------
  const customers = await Customer.insertMany([
    {
      customerId: "CUS-CB-001",
      fullName: "S. Gowtham",
      phone: "+91-8123456001",
      email: "s.gowtham@customer.com",
      gender: "Male",
      city: "Coimbatore",
      address: "Gandhipuram",
      branch: branches[0]._id,
      loyaltyPoints: 120,
      totalPurchaseAmount: 0,
      totalOrders: 0,
      customerType: "Silver",
      status: "Active",
    },
    {
      customerId: "CUS-CB-002",
      fullName: "R. Anitha",
      phone: "+91-8123456002",
      email: "r.anitha@customer.com",
      gender: "Female",
      city: "Coimbatore",
      address: "Saibaba Colony",
      branch: branches[0]._id,
      customerType: "Gold",
      status: "Active",
    },
    {
      customerId: "CUS-CB-003",
      fullName: "T. Mohamed",
      phone: "+91-8123456003",
      email: "t.mohamed@customer.com",
      gender: "Male",
      city: "Coimbatore",
      address: "Singanallur",
      branch: branches[0]._id,
      customerType: "Regular",
      status: "Active",
    },
    {
      customerId: "CUS-TP-001",
      fullName: "L. Karthik",
      phone: "+91-8123457001",
      email: "l.karthik@customer.com",
      gender: "Male",
      city: "Tirupur",
      address: "Kangeyam Road",
      branch: branches[1]._id,
      customerType: "Silver",
      status: "Active",
    },
    {
      customerId: "CUS-TP-002",
      fullName: "H. Lavanya",
      phone: "+91-8123457002",
      email: "h.lavanya@customer.com",
      gender: "Female",
      city: "Tirupur",
      address: "Vijayapuram",
      branch: branches[1]._id,
      customerType: "Platinum",
      status: "Active",
    },
  ]);

  // -----------------
  // Products
  // -----------------
  const products = await Product.insertMany([
    {
      productCode: "PRD-SIM-001",
      productName: "BestNet SIM",
      brand: "BEST",
      category: "SIM Card",
      purchasePrice: 50,
      sellingPrice: 199,
      gst: 18,
      stock: 200,
      minimumStock: 30,
      reorderLevel: 60,
      supplier: "BEST Telecom Supplier",
      warranty: "N/A",
      status: "Available",
    },
    {
      productCode: "PRD-CHG-001",
      productName: "Fast Charger 20W",
      brand: "ChargePro",
      category: "Charger",
      purchasePrice: 220,
      sellingPrice: 699,
      stock: 120,
      minimumStock: 25,
      reorderLevel: 40,
      supplier: "ChargePro Distributor",
      warranty: "6 Months",
      status: "Available",
    },
    {
      productCode: "PRD-PBK-001",
      productName: "Power Bank 10000mAh",
      brand: "PWR",
      category: "Power Bank",
      purchasePrice: 850,
      sellingPrice: 1899,
      stock: 90,
      minimumStock: 20,
      reorderLevel: 30,
      supplier: "PWR Electronics",
      warranty: "1 Year",
      status: "Available",
    },
    {
      productCode: "PRD-EAR-001",
      productName: "Wireless Earbuds",
      brand: "Aural",
      category: "Earbuds",
      purchasePrice: 950,
      sellingPrice: 2499,
      stock: 22,
      minimumStock: 30,
      reorderLevel: 40,
      supplier: "Aural Audio",
      warranty: "1 Year",
      status: "Out of Stock",
    },
    {
      productCode: "PRD-FTB-001",
      productName: "Feature Phone Combo",
      brand: "Litefone",
      category: "Feature Phone",
      purchasePrice: 1200,
      sellingPrice: 2799,
      stock: 60,
      minimumStock: 15,
      reorderLevel: 25,
      supplier: "Litefone",
      warranty: "1 Year",
      status: "Available",
    },
    {
      productCode: "PRD-FBR-001",
      productName: "Fiber Broadband Router",
      brand: "NetWave",
      category: "Fiber",
      purchasePrice: 1800,
      sellingPrice: 4999,
      stock: 18,
      minimumStock: 25,
      reorderLevel: 30,
      supplier: "NetWave",
      warranty: "2 Years",
      status: "Out of Stock",
    },
  ]);

  // -----------------
  // Inventory: product x branch
  // Make earbuds and fiber low to trigger low stock widget.
  // -----------------
  const inventoryRows = [];
  for (const b of branches) {
    for (const p of products) {
      // default stock derived from product.stock but tweak for low stock
      let current = p.stock;
      if (p.productCode === "PRD-EAR-001") current = b.branchName === "Coimbatore" ? 4 : 12;
      if (p.productCode === "PRD-FBR-001") current = b.branchName === "Coimbatore" ? 6 : 18;

      inventoryRows.push({
        product: p._id,
        branch: b._id,
        currentStock: current,
        minimumStock: p.minimumStock,
        reorderLevel: p.reorderLevel,
        maximumStock: 500,
        lastUpdated: new Date(),
      });
    }
  }
  await Inventory.insertMany(inventoryRows);

  // -----------------
  // Sales
  // -----------------
  // We'll generate sales across last 3 months, including some today.
  const productPool = products;

  const saleCount = 36;
  const payments = ["Cash", "UPI", "Card", "Net Banking"];
  const status = "Completed";

  const saleDocs = [];

  // Deterministic-ish distribution
  for (let i = 0; i < saleCount; i++) {
    const b = branches[i % branches.length];
    const empList = employeeByBranch[b._id.toString()];
    const employee = empList[i % empList.length];
    const custList = customers.filter((c) => String(c.branch) === String(b._id));
    const customer = custList[i % custList.length];

    const product = productPool[i % productPool.length];

    // Selling quantity 1..3
    const quantity = (i % 3) + 1;

    const sellingPrice = product.sellingPrice;
    const purchasePrice = product.purchasePrice;

    // Slight discount sometimes
    const discount = i % 7 === 0 ? 100 : 0;
    const totalAmount = quantity * sellingPrice - discount;
    const profit = (sellingPrice - purchasePrice) * quantity - discount;

    // createdAt distribution: today, last 7 days, and last months
    const createdAt =
      i < 6 ? daysAgo(i) :
      i < 18 ? daysAgo(7 + (i - 6) * 0.7) :
      monthsAgo(1 + (i % 2));

    saleDocs.push({
      invoiceNumber: `INV-${createdAt.getFullYear()}${pad(createdAt.getMonth() + 1)}${pad(createdAt.getDate())}-${pad(i + 1)}`,
      customer: customer._id,
      product: product._id,
      employee: employee._id,
      branch: b._id,
      quantity,
      sellingPrice,
      purchasePrice,
      discount,
      gst: product.gst ?? 18,
      paymentMethod: payments[i % payments.length],
      totalAmount,
      profit,
      status,
      saleDate: createdAt,
      createdAt,
    });
  }

  // Insert sales
  await Sale.insertMany(saleDocs);

  // Update aggregates fields for products/customers/employees/branches for better summary.
  // Note: current dashboard mostly uses Sale aggregation, but widgets use Product.totalSold and Inventory for low stock.

  // Recompute product totals from sales
  const sales = await Sale.find();
  const productAgg = new Map();
  const employeeAgg = new Map();
  const customerAgg = new Map();
  const branchAgg = new Map();

  for (const s of sales) {
    const pKey = String(s.product);
    const eKey = String(s.employee);
    const cKey = String(s.customer);
    const bKey = String(s.branch);

    productAgg.set(pKey, {
      totalSold: (productAgg.get(pKey)?.totalSold || 0) + s.quantity,
      totalRevenue: (productAgg.get(pKey)?.totalRevenue || 0) + s.totalAmount,
      totalProfit: (productAgg.get(pKey)?.totalProfit || 0) + s.profit,
    });

    employeeAgg.set(eKey, {
      monthlySales: (employeeAgg.get(eKey)?.monthlySales || 0) + s.totalAmount,
    });

    customerAgg.set(cKey, {
      totalPurchaseAmount: (customerAgg.get(cKey)?.totalPurchaseAmount || 0) + s.totalAmount,
      totalOrders: (customerAgg.get(cKey)?.totalOrders || 0) + 1,
      loyaltyPoints: (customerAgg.get(cKey)?.loyaltyPoints || 0) + s.quantity,
      lastPurchaseDate: s.createdAt,
    });

    branchAgg.set(bKey, {
      totalRevenue: (branchAgg.get(bKey)?.totalRevenue || 0) + s.totalAmount,
      totalProfit: (branchAgg.get(bKey)?.totalProfit || 0) + s.profit,
      totalSales: (branchAgg.get(bKey)?.totalSales || 0) + 1,
    });
  }

  for (const [pId, agg] of productAgg.entries()) {
    await Product.findByIdAndUpdate(pId, {
      $set: {
        totalSold: agg.totalSold,
        totalRevenue: agg.totalRevenue,
        totalProfit: agg.totalProfit,
      },
    });
  }

  for (const [eId, agg] of employeeAgg.entries()) {
    await Employee.findByIdAndUpdate(eId, {
      $set: {
        monthlySales: agg.monthlySales,
      },
    });
  }

  for (const [cId, agg] of customerAgg.entries()) {
    await Customer.findByIdAndUpdate(cId, {
      $set: {
        totalPurchaseAmount: agg.totalPurchaseAmount,
        totalOrders: agg.totalOrders,
        loyaltyPoints: agg.loyaltyPoints,
        lastPurchaseDate: agg.lastPurchaseDate,
      },
    });
  }

  for (const [bId, agg] of branchAgg.entries()) {
    await Branch.findByIdAndUpdate(bId, {
      $set: {
        totalRevenue: agg.totalRevenue,
        totalProfit: agg.totalProfit,
        totalSales: agg.totalSales,
      },
    });
  }

  // -----------------
  // Notifications: create a couple based on current inventory
  // -----------------
  const low = await Inventory.find({
    $expr: { $lte: ["$currentStock", "$minimumStock"] },
  }).populate("product");

  if (low.length) {
    await Notification.insertMany(
      low.slice(0, 4).map((item) => ({
        title: "Low Stock Alert",
        message: `${item.product.productName || "Product"} is running low at ${item.currentStock} units.`,
        type: "Low Stock",
        priority: item.currentStock <= 5 ? "High" : "Medium",
        isRead: false,
      }))
    );
  }

  console.log("✅ Seed complete: Demo data inserted.");
  console.log(`- Branches: ${branches.length} (Coimbatore, Tirupur)`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Inventory rows: ${inventoryRows.length}`);
  console.log(`- Sales: ${saleDocs.length}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});

