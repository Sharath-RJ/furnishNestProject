const mongoose = require("mongoose")

const Schema = mongoose.Schema
const customerModel = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    address: Array,

    is_active: Boolean,
    is_block: Boolean,
    is_varified: Boolean,
    token: {
        type: String,
        default: " ",
    },
    coupons:Array,
    wallet:{
        type:Number,
        default:0
    },
    referalCode:String
})

const customer = mongoose.model("customer", customerModel)
module.exports=customer
