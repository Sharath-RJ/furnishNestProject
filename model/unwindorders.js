const mongoose = require("mongoose")
const Schema = mongoose.Schema
const unwindItemModel = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers",
    },
    products: Array,
    productIds: Array,
    total: Number,
    address: String,
    paymentMethod: String,
    status: String,
})

const unwindItem = mongoose.model("unwindItem", unwindItemModel)
module.exports =unwindItem
