const { models } = require("mongoose")
const adminModel = require("../model/admin")
const userModel = require("../model/Customer")
const cartModel = require("../model/cartModel")
const productModel = require("../model/product")
const cancelationModel = require("../model/cancelation")
const orderedItemModel = require("../model/orderedItem")
const walletModel = require("../model/wallet")
const walletTransaction = require("../model/walletTransaction")
const categoryModel = require("../model/category")
const product = require("../model/product")
const adminLoginPage = async (req, res) => {
    try {
        const order = await orderedItemModel.find()
        const category = await categoryModel.find()
        const product = await productModel.find()
        if (req.session.Admin)
            res.render("backEnd/index-dark.ejs", { order, product, category })
        else res.render("backEnd/page-account-login")
    } catch (error) {
        console.log(error.message)
    }
}
const adminLogout = (req, res) => {
    try {
        req.session.Admin = false
        res.render("backEnd/page-account-login")
    } catch (error) {
        console.log(error.message)
    }
}
const loadDashBoardAgain = async (req, res) => {
    try {
        const order = await orderedItemModel.find()
        const category = await categoryModel.find()
        const product = await productModel.find()
        res.render("backEnd/index-dark", { order, product, category })
    } catch (error) {
        console.log(error.message)
    }
}
const loadDashBoard = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email, password }) //similar to email:email,pasword:password
        if (admin) {
            req.session.Admin = true
            res.redirect("/admin")
        } else {
            res.render("backEnd/page-account-login", {
                message: "Invalid credentials",
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const userList = async (req, res) => {
    try {
        let page = req.query.page || 1
        let perpage = 5
        const userCount = await userModel.find().count()
        const count = Math.ceil(userCount / perpage)
        const users = await userModel
            .find()
            .skip((page - 1) * perpage)
            .limit(perpage)
        res.render("backEnd/page-customers-list", { users, count, page })
    } catch (error) {
        console.log(error.message)
    }
}
const block = async (req, res) => {
    try {
        console.log("Inside block container")
        const user_id = req.query.id
          console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiidddddddddddddddddddddddddddddddddd",user_id)
        const status = await userModel.updateOne(
            {_id:user_id},
            { $set: { is_block: false } },
            { new: true }
        )
        if (status.modifiedCount==1) {
            req.session.is_block =false
            res.redirect("/admin/userList")
        } else res.send('<script>alert("Something went wrong")</script>')
    } catch (error) {
        console.log(error.message)
    }
}
const unblock = async (req, res) => {
    try {
        const user_id = req.query.id
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiidddddddddddddddddddddddddddddddddd",user_id)
        const status = await userModel.updateOne(
            {_id:user_id},
            { $set: { is_block:true}},
            { new: true }
        )
        console.log(status)
        if (status.modifiedCount==1) {
            req.session.is_block =true
            req.session.User = false
            res.redirect("/admin/userList")
        } else res.send('<script>alert("Something went wrong")</script>')
        // res.send("block")
    } catch (error) {
        console.log(error.message)
    }
}
const notificationLoad = async (req, res) => {
    try {
        let page = req.query.page || 1
        let perpage = 5
        const cancelCount = await cancelationModel.find().count()
        const count = Math.ceil(cancelCount / perpage)
        const ordercancel = await cancelationModel
            .find()
            .sort({ _id: -1 })
            .populate("orderId")
            .populate("userId")
            .skip((page - 1) * perpage)
            .limit(perpage)
        res.render("backEnd/order-cancel", { ordercancel, count, page })
    } catch (error) {
        console.log(error.message)
    }
}
const acceptCancel = async (req, res) => {
    try {
        const order_id = req.query.orderId
        const orderDetails = await orderedItemModel.findById(order_id)
        const payment = orderDetails.paymentMethod
        const user_id = req.query.userId
        const cancelOrder = await orderedItemModel.updateOne(
            { _id: order_id },
            { $set: { status: "Cancelled" } }
        )
        if (cancelOrder.modifiedCount == 1) {
            const orderedProduct = await orderedItemModel.findById(order_id)
            for (let product of orderedProduct.products) {
                let stockUpate = await productModel.updateOne(
                    { _id: product.id },
                    { $inc: { productStock: product.quantity } }
                )
                if (stockUpate.modifiedCount == 1) {
                    if (payment == "online_payment") {
                        const amt = parseInt(orderDetails.total)
                        await userModel
                            .updateOne(
                                { _id: user_id },
                                { $inc: { wallet: amt } }
                            )
                            .then(async () => {
                                await new walletTransaction({
                                    userId: user_id,
                                    type: "credit",
                                    amount: amt,
                                })
                                    .save()
                                    .then(() =>
                                        res.json({ response: "Refunded" })
                                    )
                            })
                    } else if (payment == "Wallet_payment") {
                        const amt = parseInt(orderDetails.total)
                        await userModel
                            .updateOne(
                                { _id: user_id },
                                { $inc: { wallet: amt } }
                            )
                            .then(async () => {
                                await new walletTransaction({
                                    userId: user_id,
                                    type: "credit",
                                    amount: amt,
                                })
                                    .save()
                                    .then(() =>
                                        res.json({ response: "RefundedWallet" })
                                    )
                            })
                    } else {
                        res.json({ response: "Cancelled" })
                    }
                }
            }
        } else res.json({ response: "Error occurred" })
    } catch (error) {
        console.log(error.message)
    }
}
const acceptReturn = async (req, res) => {
    try {
        const order_id = req.query.id
        var user_id = req.query.userid
        const returnOrder = await orderedItemModel.updateOne(
            { _id: order_id },
            { $set: { status: "Returned" } }
        )
        if (returnOrder.modifiedCount == 1) {
            const orderDetails = await orderedItemModel.findOne({
                _id: order_id,
            })
            const amt = parseInt(orderDetails.total)
            await userModel
                .updateOne({ _id: user_id }, { $inc: { wallet: amt } })
                .then(async () => {
                    //stroring wallet transaction hisstory
                    await new walletTransaction({
                        userId: user_id,
                        type: "credit",
                        amount: amt,
                    })
                        .save()
                        .then(() => res.send("Returned"))
                        .catch((err) => res.send(err))
                })
                .catch((err) => res.send(err))
        } else {
            res.send("Cannot update")
        }
    } catch (error) {
        console.log(error.message)
    }
}
const rejectCancel = async (req, res) => {
    try {
        const order_id = req.query.orderId
        const user_id = req.query.userId
        const rejectOrder = await orderedItemModel.updateOne(
            { _id: order_id },
            { $set: { status: "Cancelation Declined" } }
        )
        if (rejectOrder.modifiedCount == 1) {
            res.json({ response: "Cancelled" })
        } else res.json({ response: "Error occurred" })
    } catch (error) {
        console.log(error.message)
    }
}
const fetchDataGraph = async (req, res) => {
    try {
        const time = req.params.time
        if (time === "month") {
            const currentYear = new Date().getFullYear()
            const data = await orderedItemModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                `${currentYear}-01-01T00:00:00.000Z`
                            ),
                            $lt: new Date(
                                `${currentYear + 1}-01-01T00:00:00.000Z`
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" }, // Change "createdOn" to "createdAt"
                        ordersCount: { $sum: 1 },
                    },
                },
            ])
            const allMonths = {
                January: 0,
                February: 0,
                March: 0,
                April: 0,
                May: 0,
                June: 0,
                July: 0,
                August: 0,
                September: 0,
                October: 0,
                November: 0,
                December: 0,
            }
            data.forEach((item) => {
                const month = new Date(`2023-${item._id}-01`).toLocaleString(
                    "default",
                    { month: "long" }
                )
                allMonths[month] = item.ordersCount
            })
            res.json(allMonths)
        }
        if (time === "year") {
            const startYear = 2019
            const endYear = 2024
            const ordersByYear = {}
            for (let year = startYear; year <= endYear; year++) {
                const data = await orderedItemModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                                $lt: new Date(
                                    `${year + 1}-01-01T00:00:00.000Z`
                                ),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 },
                        },
                    },
                ])
                const orderCount = data.length > 0 ? data[0].ordersCount : 0
                ordersByYear[year] = orderCount
            }
            res.json(ordersByYear)
        }
        if (time === "week") {
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth()
            const currentDay = currentDate.getDate()
            const dayOfWeek = currentDate.getDay()
            const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ]
            const startDate = new Date(
                currentYear,
                currentMonth,
                currentDay - dayOfWeek
            )
            const ordersByDayOfWeek = {}
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate)
                date.setDate(startDate.getDate() + day)
                const data = await orderedItemModel.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(date.setHours(0, 0, 0, 0)),
                                $lt: new Date(date.setHours(23, 59, 59, 999)),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            ordersCount: { $sum: 1 },
                        },
                    },
                ])
                const orderCount = data.length > 0 ? data[0].ordersCount : 0
                ordersByDayOfWeek[dayNames[day]] = orderCount
            }
            res.json(ordersByDayOfWeek)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while fetching data.")
    }
}
 
const search = async (req, res) => {
    const query = req.body.query
    try {
        const searchCount = await productModel.find({
            productName: { $regex: new RegExp(query, "i") },
        }).count()
         const page = req.query.page || 1
         console.log("page no    bbbbb",page)
         const perpage = 5
         const count = Math.ceil(searchCount / perpage)
        const results = await productModel
            .find({
                productName: { $regex: new RegExp(query, "i") },
            })
            .skip((page - 1) * perpage)
            .limit(perpage)
        res.json({
            products:results,
            count: count,
            page: page,
            perpage: perpage,
        })
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
const orderSearch = async (req, res) => {
    const query = req.body.query
    try {
        // Perform a search in MongoDB (replace 'YourModel' and 'yourField' with your actual model and field)
        const results = await orderedItemModel.find({
            orderId: { $regex: new RegExp(query, "i") },
        })
        res.json(results)
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
module.exports = {
    adminLoginPage,
    loadDashBoard,
    adminLogout,
    userList,
    unblock,
    block,
    loadDashBoardAgain,
    notificationLoad,
    acceptCancel,
    rejectCancel,
    acceptReturn,
    fetchDataGraph,
    search,
    orderSearch,
}
