const mongoose=require('mongoose')

const Schema= mongoose.Schema

const orderModel= new Schema({
    name:String,
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customers'
    },
    email:String,
    total:Number,
    status:String,
    date:String,
    paymentMethod:String
})

const order=mongoose.model('orders',orderModel)

module.exports=order