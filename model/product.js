const mongoose=require('mongoose')
const Schema=mongoose.Schema

const productModel = new Schema({
    productName: {
        type: String,
    },
    productDescription: {
        type: String,
    },
    regularPrice: {
        type: Number,
    },
    sellingPrice: {
        type: Number,
    },
    productImage: Array,
    productCategory: {
        type:String,
      
    },
    productStock: {
        type: Number,
    },
    listOrUnlist: Boolean,
    productDiscount:Number
    // isInWishList:Boolean
})
const product=mongoose.model('product',productModel)
module.exports=product