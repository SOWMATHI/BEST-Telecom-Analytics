const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Smartphone",
        "Feature Phone",
        "Tablet",
        "Smart Watch",
        "Earbuds",
        "Charger",
        "Power Bank",
        "Mobile Cover",
        "SIM Card",
        "Broadband",
        "Fiber"
      ],
      required: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    gst: {
      type: Number,
      default: 18,
    },

    stock: {
      type: Number,
      required: true,
    },
minimumStock: {
    type: Number,
    default: 10,
},

totalSold: {
    type: Number,
    default: 0,
},

totalRevenue: {
    type: Number,
    default: 0,
},

totalProfit: {
    type: Number,
    default: 0,
},
    reorderLevel: {
      type: Number,
      default: 10,
    },

    supplier: {
      type: String,
      default: "BEST Telecom Supplier",
    },

    warranty: {
      type: String,
      default: "1 Year",
    },

    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);