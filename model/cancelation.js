const { default: mongoose } = require('mongoose')
const mongoosw=require('mongoose')

const schema=mongoose.Schema
const cancelModel = new schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderedItem",
        },
        products: Array,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
        },
        name: String,
        totalPrice: Number,
        reason:String
    },
    { timestamps: true }
)

const calcelation=mongoosw.model('cancelation',cancelModel)
module.exports=calcelation