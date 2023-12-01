const mongoose=require('mongoose')

const Schema= mongoose.Schema

const categoryModel=new Schema({
    categoryName:String,
    categoryDescription:String,
    categoryImage:String,
    list_or_unlist:Boolean,
    discount:Number
})

const category=mongoose.model('category',categoryModel)

module.exports=category