const addressModel = require("../model/address")
// const orderModel = require("../model/orders")
const orderedItemModel = require("../model/orderedItem")
const cartModel = require("../model/cartModel")
const cancelationModel = require("../model/cancelation")
const walletTransaction = require("../model/walletTransaction")
const productModel = require("../model/product")
const returnModel = require("../model/returns")
const razorpay = require("razorpay")
const customerModel = require("../model/Customer")
// const unwindItemModel = require("../model/unwindorders")
// const { productDetails } = require("./productControler")
// const { concurrency } = require("sharp")
// const order = require("../model/orders")
var instance = new razorpay({
    key_id: "rzp_test_ZiJ0sdSeL9nVQz",
    key_secret: "aMakIKJYpnq7jp3crY9HdYKt",
})
const placingOrder = async (req, res) => {
    try {
        const userData = req.session.userData
        //geting informatins to store in order collection
        const user_id = userData._id
        const cart_product = await cartModel.find({ customerId: user_id })
        const productInfo = await Promise.all(
            cart_product.map(async (cartProduct) => {
                const product = await productModel.findById(
                    cartProduct.productId
                )
                return {
                    product,
                    quantity: cartProduct.quantity,
                    cartId: cartProduct._id,
                }
            })
        )
        var productsUnavailable = false
        let productName = ""
        for (const element of productInfo) {
            const product_id = element.product._id
            const product_quantity = element.quantity
            if (element.product.productStock < product_quantity) {
                productName = element.product.productName
                productsUnavailable = true
                break
            }
        }
        //storing those data to order table
        if (!productsUnavailable) {
            function generateRazorpay(orderid, totalamount) {
                return new Promise((resolve, reject) => {
                    var options = {
                        amount: totalamount * 100,
                        currency: "INR",
                        receipt: orderid,
                    }
                    instance.orders.create(
                        options,
                        async function (error, order) {
                            if (error) {
                                console.log(error)
                            } else {
                                if (req.session.referalCode) {
                                    const referringUser =
                                        await customerModel.findOne({
                                            referalCode:
                                                req.session.referalCode,
                                        })
                                    if (referringUser) {
                                        // Update the referring user's wallet
                                        await customerModel.updateOne(
                                            {
                                                referalCode:
                                                    req.session.referalCode,
                                            },
                                            { $inc: { wallet: 100 } }
                                        )
                                        // Log the wallet transaction for the referring user
                                        await new walletTransaction({
                                            userId: referringUser._id,
                                            type: "credit",
                                            amount: 100,
                                        }).save()
                                    }
                                }
                                resolve(order)
                            }
                        }
                    )
                })
            }
            const orderid = generateOrderID(30)
            const newOrder = await new orderedItemModel({
                name: userData.firstName,
                phone: userData.phone,
                customerId: userData._id,
                email: userData.email,
                phone: userData.phone,
                total: req.session.totalAmount,
                date: new Date().toLocaleString(),
                paymentMethod: req.body.payment_option,
                products: productInfo.map((info) => ({
                    id: info.product._id,
                    name: info.product.productName,
                    sellingPrice: info.product.sellingPrice,
                    quantity: info.quantity,
                    image: info.product.productImage,
                })),
                total: req.session.totalAmount,
                address: req.body.address_Radio,
                status: "order confirmed",
                orderId: orderid,
            }).save()
            let productArray = []
            productInfo.map((info) => {
                productArray.push(info.product._id)
            })
            newOrder.productIds = productArray
            newOrder.save()
            //deleting from cart
            if (req.body.payment_option == "COD") {
                await cartModel
                    .deleteMany({ customerId: user_id })
                    .then(async () => {
                        const productInfo = await Promise.all(
                            cart_product.map(async (cartProduct) => {
                                const product = await productModel.findById(
                                    cartProduct.productId
                                )
                                return {
                                    product,
                                    quantity: cartProduct.quantity,
                                    cartId: cartProduct._id,
                                }
                            })
                        )
                        for (element of productInfo) {
                            const product_id = element.product._id
                            const product_quantity = element.quantity
                            const update = await productModel.findByIdAndUpdate(
                                product_id,
                                { $inc: { productStock: -product_quantity } },
                                { new: true }
                            )
                            if (req.session.referalCode) {
                                const referringUser =
                                    await customerModel.findOne({
                                        referalCode: req.session.referalCode,
                                    })
                                if (referringUser) {
                                    // Update the referring user's wallet
                                    await customerModel.updateOne(
                                        {
                                            referalCode:
                                                req.session.referalCode,
                                        },
                                        { $inc: { wallet: 100 } }
                                    )
                                    // Log the wallet transaction for the referring user
                                    await new walletTransaction({
                                        userId: referringUser._id,
                                        type: "credit",
                                        amount: 100,
                                    }).save()
                                }
                            }
                            if (update) res.json({ response: "codsuccess" })
                        }
                    })
                    .catch((err) => console.log("error occured" + err))
            } else if (req.body.payment_option == "online_payment") {
                generateRazorpay(
                    newOrder.orderId,
                    req.session.totalAmount
                ).then((response) => {
                    res.json(response)
                })
            } else if (req.body.payment_option == "Wallet_payment") {
                var userId = req.session.userData._id
                const user = await customerModel.findById(userId)
                let walletAmount = user.wallet
                let totalAmount = req.session.totalAmount
                if (totalAmount > walletAmount) {
                    res.json({ response: "no_balance" })
                } else {
                    await cartModel
                        .deleteMany({ customerId: user_id })
                        .then(async () => {
                            const productInfo = await Promise.all(
                                cart_product.map(async (cartProduct) => {
                                    const product = await productModel.findById(
                                        cartProduct.productId
                                    )
                                    return {
                                        product,
                                        quantity: cartProduct.quantity,
                                        cartId: cartProduct._id,
                                    }
                                })
                            )
                            for (element of productInfo) {
                                const product_id = element.product._id
                                const product_quantity = element.quantity
                                await productModel
                                    .findByIdAndUpdate(
                                        product_id,
                                        {
                                            $inc: {
                                                productStock: -product_quantity,
                                            },
                                        },
                                        { new: true }
                                    )
                                    .then(async () => {
                                        await customerModel
                                            .updateOne(
                                                { _id: userId },
                                                {
                                                    $inc: {
                                                        wallet: -totalAmount,
                                                    },
                                                }
                                            )
                                            .then(async () => {
                                                await new walletTransaction({
                                                    userId: userId,
                                                    type: "debit",
                                                    amount: totalAmount,
                                                })
                                                    .save()
                                                    .then(async () => {
                                                        if (
                                                            req.session
                                                                .referalCode
                                                        ) {
                                                            const referringUser =
                                                                await customerModel.findOne(
                                                                    {
                                                                        referalCode:
                                                                            req
                                                                                .session
                                                                                .referalCode,
                                                                    }
                                                                )
                                                            if (referringUser) {
                                                                // Update the referring user's wallet
                                                                await customerModel.updateOne(
                                                                    {
                                                                        referalCode:
                                                                            req
                                                                                .session
                                                                                .referalCode,
                                                                    },
                                                                    {
                                                                        $inc: {
                                                                            wallet: 100,
                                                                        },
                                                                    }
                                                                )
                                                                await new walletTransaction(
                                                                    {
                                                                        userId: referringUser._id,
                                                                        type: "credit",
                                                                        amount: 100,
                                                                    }
                                                                ).save()
                                                            }
                                                        }
                                                        res.json({
                                                            response:
                                                                "walletUpdated",
                                                        })
                                                    })
                                            })
                                    })
                            }
                        })
                        .catch((err) => console.log("error occured" + err))
                }
            }
        } else {
            res.json({ response: "out of stock", product: productName })
        }
    } catch (error) {
        console.log(error.message)
    }
}
function generateOrderID(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const idLength = length || 12 // You can specify the length you want
    let result = ""
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }
    return result
}
const orderList = async (req, res) => {
    try {
        let page = req.query.page || 1
        let perpage = 5
        const orderCount = await orderedItemModel.find().count()
        const count = Math.ceil(orderCount / perpage)
        const orders = await orderedItemModel
            .find()
            .sort({ _id: -1 })
            .skip((page - 1) * perpage)
            .limit(perpage)
        res.render("backEnd/order-list", { orders, count, page })
    } catch (error) {
        console.log(error.message)
    }
}
const orderDetails = async (req, res) => {
    try {
        const user_id = req.query.id
        const order_id = req.query.order
        const order = await orderedItemModel
            .findById(order_id)
            .populate("customerId")
            .populate("productIds")
        const product = order.products
        res.render("backEnd/order-details", {
            order,
            product,
        })
    } catch (error) {
        console.log(error.message)
    }
}
const viewMyOrders = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const myOrders = await orderedItemModel.find({ customerId: user_id })
        res.render("frontEnd/my-orders", { myOrders })
    } catch (error) {
        console.log(error.message)
    }
}
const cancelOrder = async (req, res) => {
    try {
        const order_id = req.query.id
        const orderDetails = await orderedItemModel.findById(order_id)
        const orderCancel = new cancelationModel({
            orderId: order_id,
            userId: req.session.userData._id,
            name: orderDetails.name,
            totalPrice: orderDetails.total,
            reason: req.body.reason,
        })
        orderCancel
            .save()
            .then(async () => {
                const cancelRequested = await orderedItemModel.updateOne(
                    { _id: order_id },
                    { $set: { status: "Cancel Requested" } }
                )
                if (cancelRequested.modifiedCount == 1)
                    res.json({ response: "saved" })
                else res.json({ response: "not saved" })
            })
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error.message)
    }
}
const updateStatus = async (req, res) => {
    try {
        const status = req.query.status
        const id = req.query.id
        if (status == "Delivered") {
            req.session.deliveryDate = new Date()
        }
        let result = await orderedItemModel.updateOne(
            { _id: id },
            { $set: { status: status } }
        )
        if (result.modifiedCount == 1) res.redirect("/admin/order/orderList")
        else res.send("</script>alert('Something went wrong')</script>")
    } catch (error) {
        console.log(error.message)
    }
}
const addingAddressLoad = (req, res) => {
    try {
        res.render("frontEnd/add-address")
    } catch (error) {
        console.log(error.message)
    }
}
const addingAddress = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const {
            firstName,
            lastName,
            address,
            city,
            state,
            landMark,
            zipcode,
            phone,
            email,
        } = req.body
        await new addressModel({
            customerId: user_id,
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            state: state,
            landMark: landMark,
            pincode: zipcode,
            phone: phone,
            email: email,
        })
            .save()
            .then(() => res.json({ response: "ok" }))
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error.message)
    }
}
const loadVerify = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const { payment, order } = req.body
        let or = JSON.parse(order)
        let orderid = or.receipt
        const success = await cartModel.deleteMany({ customerId: user_id })
        if (success) {
            res.json({ orderid: orderid })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const returnOrder = async (req, res) => {
    try {
        const order_id = req.query.id
        const user_id = req.session.userData._id
        await new returnModel({
            userId: user_id,
            orderId: order_id,
        })
            .save()
            .then(async () => {
                await orderedItemModel
                    .updateOne(
                        { _id: order_id },
                        { $set: { status: "return requested" } }
                    )
                    .then(() => res.json({ response: "returned" }))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))()
    } catch (error) {
        console.log(error.message)
    }
}
const returnOrderListing = async (req, res) => {
    try {
        let page = req.query.page || 1
        let perpage = 5
        const returnCount = await returnModel.find().count()
        const count = Math.ceil(returnCount / perpage)
        const orderReturn = await returnModel
            .find()
            .sort({ _id: -1 })
            .populate("orderId")
            .populate("userId")
            .skip((page - 1) * perpage)
            .limit(perpage)
        res.render("backEnd/order-return", { orderReturn, count, page })
    } catch (error) {
        console.log(error.message)
    }
}
const returnDetails = async (req, res) => {
    try {
        const order_id = req.query.id
        const returnDetails = await returnModel
            .findById(order_id)
            .populate("orderId")
            .populate("userId")
        res.render("backEnd/order-return-details", {
            returnDetails,
        })
    } catch (error) {
        console.log(error.message)
    }
}
const cancelDetails = async (req, res) => {
    try {
        const order_id = req.query.id
        const cancelDetails = await cancelationModel
            .findById(order_id)
            .populate("orderId")
            .populate("userId")
        res.render("backEnd/cancelDetails", {
            cancelDetails,
        })
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    placingOrder,
    orderList,
    orderDetails,
    viewMyOrders,
    cancelOrder,
    updateStatus,
    addingAddressLoad,
    addingAddress,
    loadVerify,
    returnOrder,
    returnOrderListing,
    returnDetails,
    cancelDetails,
}
