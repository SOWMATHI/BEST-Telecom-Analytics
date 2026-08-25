const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
{
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

    currentStock:{
        type:Number,
        required:true
    },

    minimumStock:{
        type:Number,
        default:10
    },

    reorderLevel:{
        type:Number,
        default:20
    },

    maximumStock:{
        type:Number,
        default:500
    },

    lastUpdated:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps:true
}
);

module.exports=mongoose.model("Inventory",inventorySchema);