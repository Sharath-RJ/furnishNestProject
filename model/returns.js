const { default: mongoose } = require("mongoose")
const mongoosw = require("mongoose")

const schema = mongoose.Schema
const returnModel = new schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderedItem",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
        },
    },
    { timestamps: true }
)

const returns = mongoosw.model("returns", returnModel)
module.exports = returns
