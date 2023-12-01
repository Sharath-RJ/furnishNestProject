const mongoose=require('mongoose')
const Schema=mongoose.Schema
const couponModel= new Schema({
    code:String,
    minPurchase:Number,
    discount:Number,
    expiry:String,
    description:String,
    maxAmount:Number

})

const coupons=mongoose.model('coupons',couponModel)

module.exports=coupons