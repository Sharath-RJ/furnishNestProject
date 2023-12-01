const mongoose=require('mongoose')
const { schema } = require('./admin')
const Schema = mongoose.Schema
const walletModel= new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer'
    },
    Amount:Number
}) 
const wallet=mongoose.model('wallet',walletModel)
module.exports=wallet