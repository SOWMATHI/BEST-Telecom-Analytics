const express = require("express");

const router = express.Router();

const {
    getPurchaseOrders,
    addPurchaseOrder
}=require("../controllers/purchaseOrderController");

router.get("/",getPurchaseOrders);

router.post("/",addPurchaseOrder);

module.exports=router;