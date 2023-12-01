const { json } = require("body-parser")
const couponModel = require("../model/coupon")
const customerModel = require("../model/Customer")
const addCoupon = async (req, res) => {
    try {
        const coupons = await couponModel.find()
        res.render("backEnd/coupon-management", { coupons })
    } catch (error) {
        console.log(error.message)
    }
}
const addingCoupon = async (req, res) => {
    try {
        const {
            couponCode,
            couponDescription,
            minPurchase,
            couponExpiry,
            couponDiscount,
            maxAmount,
        } = req.body
        const alreadyExists = await couponModel.find({
            code: couponCode,
        })
        if (alreadyExists.length !== 0)
            res.send(
                '<script>alert("Coupon already exists");window.location.href="/admin/coupons"</script>'
            )
        else {
            const formatedDate = new Date(couponExpiry)
            const formatedDateString = `${formatedDate.getDate()}-${
                formatedDate.getMonth() + 1
            }-${formatedDate.getFullYear()}`
            await new couponModel({
                code: couponCode,
                minPurchase: minPurchase,
                discount: couponDiscount,
                expiry: formatedDateString,
                description: couponDescription,
                maxAmount: maxAmount,
            })
                .save()
                .then(() => res.json({ response: "added" }))
                .catch((err) => console.log(err))
        }
    } catch (error) {
        console.log(error.message)
    }
}
const editCoupon = async (req, res) => {
    try {
        const coupon_id = req.query.id
        const coupon = await couponModel.findById(coupon_id)
        res.render("backEnd/editCoupon", { coupon })
    } catch (error) {
        console.log(error.message)
    }
}
const editingCoupon = async (req, res) => {
    try {
        const coupon_id = req.query.id
        const obj = JSON.parse(JSON.stringify(req.body))
        const updatedInfo = obj
        const updateCoupon = await couponModel.findByIdAndUpdate(
            coupon_id,
            updatedInfo,
            { new: true }
        )
        if (updateCoupon) res.redirect("/admin/coupons")
        else res.send("Error while updating")
    } catch (error) {
        console.log(error.message)
    }
}
const deleteCoupon = async (req, res) => {
    try {
        const coupon_id = req.query.id
        const deleteCoupon = await couponModel.findByIdAndDelete(coupon_id)
        if (deleteCoupon) res.redirect("/admin/coupon/couponList")
        else res.send("Error while deleting")
    } catch (error) {
        console.log(error.message)
    }
}
const applyingCoupon = async (req, res) => {
    try {
        // const obj = JSON.parse(JSON.stringify(req.body))
        const couponCode = req.body.couponCode
        const coupon = await couponModel.findOne({ code: couponCode })
        const user = await customerModel.findOne({
            _id: req.session.userData._id,
        })
        const totalAmount = req.session.totalAmount
        let minPurchase = coupon.minPurchase
        let discount = coupon.discount
        let expiry = coupon.expiry
        let maxAmount = coupon.maxAmount
        //finfing date
        const currentDate = new Date()
        const currentDay = currentDate.getDate()
        const currentMonth = currentDate.getMonth() + 1 // Adding 1 to account for the zero-based index
        const currentYear = currentDate.getFullYear()
        const currentDateString = `${currentDay}-${currentMonth}-${currentYear}`
        // Convert the expiry date to a comparable format in "dd-mm-yyyy"
        const expiryDateParts = expiry.split("-")
        const expiryDay = parseInt(expiryDateParts[0], 10)
        const expiryMonth = parseInt(expiryDateParts[1], 10)
        const expiryYear = parseInt(expiryDateParts[2], 10)
        const expiryDate = new Date(expiryYear, expiryMonth - 1, expiryDay)
        //finding discount
        let off = (totalAmount * discount) / 100
        if (off > maxAmount) {
            discountedPrice = totalAmount - maxAmount
        } else {
            discountedPrice = totalAmount - off
        }
        if (!user.coupons.includes(couponCode)) {
            if (totalAmount > minPurchase) {
                if (currentDate < expiryDate) {
                    req.session.totalAmount = discountedPrice
                    await customerModel
                        .updateOne(
                            { _id: req.session.userData._id },
                            { $push: { coupons: couponCode } }
                        )
                        .then(() => {
                            res.status(200).json({
                                response: "success",
                                discountedPrice: discountedPrice,
                                discount: discount,
                            })
                        })
                        .catch((err) => console.log("errror occurreed", err))
                } else {
                    res.status(200).json({ response: "expired" })
                }
            } else {
                res.status(200).json({ response: "failed" })
            }
        } else {
            res.status(200).json({ response: "exists" })
        }
    } catch (error) {
        console.log(error.message)
        res.redirect("/")
    }
}
const showCoupon = async (req, res) => {
    try {
        const totalAmount = req.session.totalAmount
        const user = await customerModel.findById(req.session.userData._id)
        const currentDate = new Date()
        const currentDay = currentDate.getDate()
        const currentMonth = currentDate.getMonth() + 1 // Adding 1 to account for the zero-based index
        const currentYear = currentDate.getFullYear()
        const currentDateString = `${currentDay}-${currentMonth}-${currentYear}`
        const coupons = await couponModel.find({
            minPurchase: { $lte: totalAmount },
            expiry: { $gte: currentDateString },
            code: { $not: { $in: user.coupons } },
        })
        res.json({ response: coupons })
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    addCoupon,
    addingCoupon,
    editCoupon,
    editingCoupon,
    deleteCoupon,
    applyingCoupon,
    showCoupon,
}
