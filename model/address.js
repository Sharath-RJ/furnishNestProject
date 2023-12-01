const mongoose=require('mongoose')
const schema=mongoose.Schema
const addressModel=new schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customers'
    },
    firstName:String,
    lastName:String,
    address:String,
    city:String,
    state:String,
    landMark:String,
    pincode:String,
    phone:Number,
    email:String
})

const address=mongoose.model('address',addressModel)
module.exports=address