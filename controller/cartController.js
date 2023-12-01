const cartModel = require("../model/cartModel")
const productModel = require("../model/product")
const addressModel = require("../model/address")
const addToCart = async (req, res) => {
    try {
        let outOfStock = false
        const user_id = req.session.userData._id
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",user_id)
        const product_id = req.query.id
        const product = await productModel.findById(product_id)
        const productExists = await cartModel.find({ productId: product_id })
        if (productExists.length == 0) {
            const cart = new cartModel({
                customerId: user_id,
                productId: product_id,
                quantity: 1,
            })
            await cart.save()
        } else if (product.productStock >= productExists[0].quantity) {
            await cartModel.updateOne(
                { productId: product_id },
                { $inc: { quantity: 1 } }
            )
        } else {
            outOfStock = true
        }
        if (outOfStock) res.json({ message: "Out of Stock" })
        else {
            const cart_products = await cartModel.find({ customerId: user_id })
            if (cart_products) res.send(cart_products)
        }
    } catch (error) {
        console.log(error.message)
    }
}
const countCartNumber = async (req, res) => {
    const user_id = req.session.userData
    const cart_products = await cartModel.find({ customerId: user_id })
    if (cart_products) res.send(cart_products.length)
}
const viewCart = async (req, res) => {
    try {
        user_id = req.session.userData._id
        const cart_products = await cartModel.find({ customerId: user_id })
        const productInfo = await Promise.all(
            cart_products.map(async (cartProduct) => {
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
        console.log("jbfjfhjvbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",productInfo)
        const totalAmount = productInfo.reduce((total, item) => {
            return total + item.product.sellingPrice * item.quantity
        }, 0)
        req.session.totalAmount = totalAmount
        res.render("frontEnd/shop-cart", { productInfo, totalAmount })
    } catch (error) {
        console.log(error.message)
    }
}
const updateQuantity = async (req, res) => {
    try {
        const cart_id = req.query.id
        const order = req.query.order
        const cart = await cartModel.findByIdAndUpdate(
            cart_id,
            { $inc: { quantity: order } },
            { new: true }
        )
        if (cart) {
            res.send(cart)
        }
    } catch (error) {
        console.log(error.message)
    }
}
const getProductDetails = async (req, res) => {
    try {
        const id = req.query.id
        const product = await productModel.findById(id)
        res.send(product)
    } catch (error) {
        console.log(error.message)
    }
}
const removeCart = async (req, res) => {
    try {
        const id = req.query.id
        await cartModel
            .findByIdAndDelete(id)
            .then(() => res.json({ response: "removed" }))
            .catch(() =>
                res.send('<script>alert("Something went wrong")</script>')
            )
    } catch (error) {
        console.log(error.message)
    }
}
const checkOut = async (req, res) => {
    try {
        const user_id = req.session.userData._id
        const address = await addressModel.find({ customerId: user_id })
        const cart_products = await cartModel.find({ customerId: user_id })
        const productInfo = await Promise.all(
            cart_products.map(async (cartProduct) => {
                const product = await productModel.findById(
                    cartProduct.productId
                )
                return {
                    product,
                    quantity: cartProduct.quantity,
                }
            })
        )
        const totalAmount = productInfo.reduce((total, item) => {
            return total + item.product.sellingPrice * item.quantity
        }, 0)
        if (cart_products.length !== 0) {
            res.render("frontEnd/page-checkout", {
                productInfo,
                totalAmount,
                address,
            })
        } else {
            res.send(
                '<script>alert("Cart is empty");window.location.href="/viewCart"</script>'
            )
        }
    } catch (error) {
        console.log(error.message)
    }
}
const getProductInfo = async (req, res) => {
    const user_id = req.session.userData._id
    const cart_products = await cartModel.find({ customerId: user_id })
    const productPromises = cart_products.map(async (cartItem) => {
        const product = await productModel.findById(cartItem.productId)
        return {
            quantity: cartItem.quantity,
            sellingPrice: product.sellingPrice,
        }
    })
    const products = await Promise.all(productPromises)
    res.send(products)
}
const getQuantity = async (req, res) => {
    try {
        const id = req.query.id
        const cart = await cartModel.findById(id)
        res.send(cart)
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    addToCart,
    viewCart,
    updateQuantity,
    getProductDetails,
    removeCart,
    checkOut,
    getQuantity,
    getProductInfo,
    countCartNumber,
}
