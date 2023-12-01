const mongoose=require('mongoose')

const Schema=mongoose.Schema

const adminModel=new Schema({
    name:String,
    email:String,
    password:String
})


const admin= mongoose.model('admins',adminModel)
let run =async ()=>{
    console.log("working", await admin.find())
    
}
run()
module.exports=admin
