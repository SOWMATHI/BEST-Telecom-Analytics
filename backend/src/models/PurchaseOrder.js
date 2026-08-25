const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
{
    purchaseOrderNo:{
        type:String,
        required:true,
        unique:true
    },

    supplier:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Supplier",
        required:true
    },

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    purchasePrice:{
        type:Number,
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },

    orderDate:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        enum:["Ordered","Received","Cancelled"],
        default:"Ordered"
    }

},
{
    timestamps:true
}
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);