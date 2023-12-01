const mongoose=require('mongoose')
const Schema=mongoose.Schema
const orderedItemModel = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
    },

    products: Array,
    productIds:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    total: Number,
    address: String,
    name: String,
    phone: String,
    email: String,
    total: Number,
    status: String,
    date: String,
    paymentMethod: String,
    orderId: String,
},{timestamps:true})

const orderedItem=mongoose.model('orderedItem',orderedItemModel)
module.exports=orderedItem