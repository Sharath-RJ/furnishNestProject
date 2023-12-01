const customerModel = require("../model/Customer")
const addressModel = require("../model/address")
const ordereModel = require("../model/orders")
const orderedItemModel = require("../model/orderedItem")
const walletTransactionModel = require("../model/walletTransaction")
const Swal = require("sweetalert2")
const util = require("util")
const bcrypt = require("bcrypt")
const { log } = require("console")
const userProfileLoad = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const userDetails = await customerModel.findById(user_id)
        const walletTransaction = await walletTransactionModel.find({
            userId: user_id,
        })
        const myOrders = await orderedItemModel
            .find({ customerId: user_id })
            .sort({ _id: -1 })
        const address = await addressModel.find({ customerId: user_id })
        res.render("frontEnd/my-account", {
            userDetails,
            myOrders,
            address,
            walletTransaction,
        })
    } catch (error) {
        console.log(error)
    }
}
const editUserprofile = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const userDetails = await customerModel.findById(user_id)
        res.render("frontEnd/edit-user-profile", { userDetails })
    } catch (error) {
        console.log(error.message)
    }
}
const editUserDetails = async (req, res) => {
    const user_id = req.session.userData._id
    const updatedInfo = req.body
    const updateDetails = await customerModel.findByIdAndUpdate(
        user_id,
        updatedInfo,
        { new: true }
    )
    if (updateDetails) res.json({ response: "updated" })
    else res.json({ response: "notUpdated" })
}
const addressManagement = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const address = await addressModel.find({ customerId: user_id })
        res.render("frontEnd/address-management", { address })
    } catch (error) {
        console.log(error.message)
    }
}
const editAddress = async (req, res) => {
    try {
        const id = req.query.id
        const address = await addressModel.findById(id)
        res.render("frontEnd/edit-address", { address })
    } catch (error) {
        console.log(error.message)
    }
}
const editingAddress = async (req, res) => {
    try {
        const address_id = req.query.id
        const id = req.session.userData._id
        const obj = JSON.parse(JSON.stringify(req.body)) // req.body = [Object: null prototype] { title: 'product' }
        let result = await addressModel.updateOne(
            { $and: [{ customerId: id }, { _id: address_id }] },
            obj
        )
        if (result.modifiedCount == 1)
            res.json({ response: "updatedSuccessfully" })
        else res.json({ response: "notUpdated" })
    } catch (error) {
        console.log(error.message)
    }
}
const changeingPassword = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const { oldPassword, newPassword } = req.body
        const customer = await customerModel.findById(user_id)
        const matchPassword = await bcrypt.compare(
            oldPassword,
            customer.password
        )
        if (matchPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await customerModel
                .updateOne(
                    { _id: user_id },
                    { $set: { password: hashedPassword } }
                )
                .then(() => res.status(200).json("Updated Successfully"))
                .catch((err) => console.log(err))
        } else {
            res.json({ response: "PasswordMismatch" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const addingAddress = async (req, res) => {
    try {
        const userData = req.session.userData
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
            customerId: userData._id,
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
            .then(() => res.json({ response: "saved" }))
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error.message)
    }
}
const showOrderDetails = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const order_id = req.query.id
        const orderDetails = await orderedItemModel.findById(order_id)
        res.render("frontEnd/view-order-details", { orderDetails })
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    userProfileLoad,
    editUserprofile,
    editUserDetails,
    addressManagement,
    editAddress,
    editingAddress,
    changeingPassword,
    addingAddress,
    showOrderDetails,
}
