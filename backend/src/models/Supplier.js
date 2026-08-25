const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
{
    supplierCode:{
        type:String,
        required:true,
        unique:true
    },

    supplierName:{
        type:String,
        required:true
    },

    companyName:{
        type:String,
        required:true
    },

    contactPerson:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    gstNumber:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},
{
    timestamps:true
}
);

module.exports=mongoose.model("Supplier",supplierSchema);