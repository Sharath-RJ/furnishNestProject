const mongoose=require('mongoose')
const Schema=mongoose.Schema
const wishListModel=new Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    products:[
       {
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
       }
    ]
})

const wishlist=mongoose.model('wishlist',wishListModel)
module.exports=wishlist