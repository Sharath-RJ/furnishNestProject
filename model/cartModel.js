const mongoose=require('mongoose')
const schema=mongoose.Schema

const cartModel=new schema({
   customerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'customers'
   },
   productId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'products'
   }],
   quantity:Number

},{timestamps:true})

const cart=mongoose.model('cart',cartModel)
module.exports=cart