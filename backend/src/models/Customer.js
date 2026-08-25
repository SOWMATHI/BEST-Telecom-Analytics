const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
    },

    totalPurchaseAmount: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    lastPurchaseDate: {
      type: Date,
    },

    customerType: {
      type: String,
      enum: ["Regular", "Silver", "Gold", "Platinum"],
      default: "Regular",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);