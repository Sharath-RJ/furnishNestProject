const mongoose=require('mongoose')
const Schema=mongoose.Schema
const walletTransactionModel=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer'
    },
    type:String,
    amount:Number
},{timestamps:true})

const walletTransaction=mongoose.model('walletTransaction',walletTransactionModel)
module.exports=walletTransaction