const product = require("../model/product")
const wishListModel = require("../model/wishlist")
const addToWishList = async (req, res) => {
    try {
        const product_id = req.query.id
        const updatedWishList = await wishListModel.findOne({
            userID: req.session.userData._id,
        })
        // Check if updatedWishList is null
        const length = updatedWishList ? updatedWishList.products.length : 0
        const wishList = await wishListModel.updateOne(
            { userID: req.session.userData._id },
            { $addToSet: { products: product_id } },
            { new: true, upsert: true }
        )
        if (wishList.modifiedCount === 1)
            res.json({ response: "Added", count: length })
        else res.json({ response: "alreadyAdded" })
    } catch (error) {
        console.log(error.message)
    }
}
const viewWishList = async (req, res) => {
    try {
        const wishList = await wishListModel
            .findOne({ userID: req.session.userData._id })
            .populate("products")
        res.render("frontEnd/wishList", { wishList })
    } catch (error) {
        console.log(error.message)
    }
}
const removeWishList = async (req, res) => {
    try {
        const product_id = req.query.id
        const user_id = req.session.userData._id
        const updatedWishList = await wishListModel.findOne({
            userID: user_id,
        })
        const length = updatedWishList.products.length
        const removeWishList = await wishListModel.updateOne(
            { userID: user_id },
            { $pull: { products: product_id } }
        )
        if (removeWishList.modifiedCount == 1)
            res.json({ response: "removed", count: length })
        else res.send("cannot remove")
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    addToWishList,
    viewWishList,
    removeWishList,
}
