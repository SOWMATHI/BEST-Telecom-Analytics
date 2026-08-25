const PurchaseOrder = require("../models/PurchaseOrder");

const getPurchaseOrders = async (req, res) => {
    try {

        const purchaseOrders = await PurchaseOrder.find()
        .populate("supplier")
        .populate("product")
        .populate("branch");

        res.status(200).json(purchaseOrders);

    } catch (error) {

        res.status(500).json({
            message:error.message
        });

    }
};

const addPurchaseOrder = async (req,res)=>{

    try{

        const purchaseOrder = await PurchaseOrder.create(req.body);

        res.status(201).json(purchaseOrder);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

module.exports={
    getPurchaseOrders,
    addPurchaseOrder
};