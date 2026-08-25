const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
{
    invoiceNumber:{
        type:String,
        required:true,
        unique:true
    },

    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },

    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true
    },

    quantity:{
        type:Number,
        required:true,
        min:1
    },

    sellingPrice:{
        type:Number,
        required:true
    },

    purchasePrice:{
        type:Number,
        required:true
    },

    discount:{
        type:Number,
        default:0
    },

    gst:{
        type:Number,
        default:18
    },

    paymentMethod:{
        type:String,
        enum:["Cash","UPI","Card","Net Banking"],
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },

    profit:{
        type:Number,
        default:0
    },

    saleDate:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        enum:["Completed","Cancelled"],
        default:"Completed"
    }

},
{
    timestamps:true
}
);

module.exports=mongoose.model("Sale",saleSchema);