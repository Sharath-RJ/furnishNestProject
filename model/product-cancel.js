const mongoose=require('mongoose')
const Schema=mongoose.Schema
const cancelationModel=new Schema({
    productName:String,
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    customerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"customers"
    },
    deliveryAddress:String,
    Date:String
})

const cancelation=mongoose.model('cancelation',cancelationModel)
module.exports={
    cancelation
}