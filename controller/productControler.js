const productModel = require("../model/product")
const categoryModel = require("../model/category")
const cartModel = require("../model/cartModel")
const wishListModel = require("../model/wishlist")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const { json } = require("body-parser")
const loadAddProduct = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        res.render("backEnd/page-form-product-1", { categories })
    } catch (error) {
        console.log(error.message)
    }
}
const viewProducts = async (req, res) => {
    try {
        const productCount = await productModel.find().count()
        const page = req.query.page || 1
        const perpage = 5
        const count = Math.ceil(productCount / perpage)
        const products = await productModel
            .find()
            .sort({_id:1})
            .skip((page - 1) * perpage)
            .limit(perpage)
        if (req.query.ajax == "true") {
            res.json({
                products: products,
                count: count,
                page: page,
                perpage:perpage
            })
        } else {
            res.render("backend/page-products-grid", { products, count, page,perpage })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const viewProductPagination = async (req, res) => {
    try {
        res.send(products)
    } catch (error) {
        console.log(error.message)
    }
}
const deleteProduct = async (req, res) => {
    try {
        const product_id = req.query.id
        
        const product = await productModel.findByIdAndRemove(product_id)
        if (product) {
         //const index = await productModel.find({}).sort({_id: 1 }).then(docs => docs.findIndex(doc => doc._id.toString() === product_id));
         res.json({ response: "removed" })
        }
        else
            res.send(
                '<script>alert("Something went wrong");window.location.href="/backEnd/page-products-grid.ejs"</script>'
            )
    } catch (error) {
        console.log(error.message)
    }
}
const editProduct = async (req, res) => {
    try {
        const product_id = req.query.id
        const categories = await categoryModel.find()
        const product = await productModel.findById(product_id)
        if (product)
            res.render("backEnd/page-edit-product", { product, categories })
        else res.send('<script>alert("Something went wrong")</script>')
    } catch (error) {
        console.log(error.message)
    }
}
const editingProduct = async (req, res) => {
    try {
        const product_id = req.query.id
        const updatedInfo = req.body
        if (req.body.changedImage) {
            const changedImageArray = req.body.changedImage.split(",")
            changedImageArray.forEach(async (index, i) => {
                //cropping image
                const randomInteger = Math.floor(Math.random() * 20000001)
                const imageDirectory = "public/backEnd/images/cropped_image/"
                let imgFileName = "cropped" + randomInteger + ".jpg"
                let imagePath = path.join(imageDirectory, imgFileName)
                const croppedImage = await sharp(req.files[i].path)
                    .resize(300, 300, {
                        fit: "fill",
                    })
                    .toFile(imagePath)
                if (croppedImage) {
                    await productModel.updateOne(
                        { _id: product_id },
                        {
                            $set: {
                                [`productImage.${index}`]: imgFileName,
                            },
                        },
                        { new: true }
                    )
                }
            })
        }
        for (let file of req.files) {
            const randomInteger = Math.floor(Math.random() * 20000001)
            const imageDirectory = "public/backEnd/images/cropped_image/"
            let imgFileName = "cropped" + randomInteger + ".jpg"
            let imagePath = path.join(imageDirectory, imgFileName)
            const croppedImage = await sharp(file.path)
                .resize(300, 300, {
                    fit: "fill",
                })
                .toFile(imagePath)
            if (croppedImage) {
                await productModel.updateOne(
                    { _id: product_id },
                    { $push: { productImage: imgFileName } }
                )
            }
        }
        const productUpdate = await productModel.findByIdAndUpdate(
            product_id,
            updatedInfo
        )
        if (productUpdate) res.redirect("/admin/product/viewProducts")
        else res.send('<script>alert("Something went wrong")</script>')
    } catch (error) {
        console.log(error.message)
    }
}
const insertProduct = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        const {
            productName,
            productDescription,
            regularPrice,
            sellingPrice,
            category,
            stock,
            productDiscount,
        } = req.body
        const newproduct = new productModel({
            productName: productName,
            productDescription: productDescription,
            regularPrice: regularPrice,
            sellingPrice: sellingPrice,
            productCategory: category,
            productStock: stock,
            listOrUnlist: true,
            productDiscount: productDiscount,
            productImage: [],
        })
        for (let file of req.files) {
            const randomInteger = Math.floor(Math.random() * 20000001)
            const imageDirectory = "public/backEnd/images/cropped_image/"
            let imgFileName = "cropped" + randomInteger + ".jpg"
            let imagePath = path.join(imageDirectory, imgFileName)
            const croppedImage = await sharp(file.path)
                .resize(300, 300, {
                    fit: "fill",
                })
                .toFile(imagePath)
            if (croppedImage) {
                newproduct.productImage.push(imgFileName)
            }
        }
        newproduct
            .save()
            .then(() =>
                res.render("backEnd/page-form-product-1", {
                    success: "Added Successfully",
                    categories,
                })
            )
            .catch((err) => {
                console.log(err)
                res.render("backEnd/page-form-product-1", {
                    error: "Failed to Add",
                    categories,
                })
            })
    } catch (error) {
        console.log(error.message)
    }
}
const productDetails = async (req, res) => {
    try {
        const product_id = req.query.id
        const userData = req.session.userData
        if(userData)
        {
           var cart_products = await cartModel.find({ customerId: userData._id }) 
           var wish_list = await wishListModel.findOne({ userID: userData._id }) 
           var userName=req.session.userData.firstName 
        }else{
            cart_products=[]
            wish_list={
                products:{}
            }
        }
       
        const categories = await categoryModel.find()
        
        const category_name = categories.categoryName
        const productDetails = await productModel.findById(product_id)
        const relatedProducts = await productModel.find({
            productCategory: category_name,
        })
        // Check if wish_list is null or if products is null
        let inWishList = false
        if (wish_list && wish_list.products.length > 0) {
            inWishList = wish_list?.products?.includes(product_id) ?? false
        }
        if (productDetails) {
            res.render("frontEnd/shop-product-full", {
                productDetails,
                categories,
                relatedProducts,
                userData,
                cart_products,
                wish_list,
                inWishList,
                user: userName,
            })
        } else {
            res.send('<script>alert("Something went wrong")</script>')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const showAllProducts = async (req, res) => {
    try {
       
        const minPrice = parseFloat(req.query.minPrice) || -Infinity
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity
        if(req.session.userData)
        { var user_id = req.session.userData._id
         var wish_list = await wishListModel.findOne({ userID: user_id })
        }else{
            wish_list=[]
        }
       
        let perpage = 5
        let page = parseInt(req.query.page) || 1
        const categories = await categoryModel.find()
        const cart_products = await cartModel.find()
        const category = req.query.name
        if (category !== undefined) {
            req.session.categoryName = category
        }
        const productCount = await productModel.countDocuments({
            productCategory: req.session.categoryName,
            sellingPrice: { $gte: minPrice, $lte: maxPrice },
        })
        const count = Math.ceil(productCount / perpage)
        const products = await productModel
            .find({
                productCategory: req.session.categoryName,
                sellingPrice: { $gte: minPrice, $lte: maxPrice },
            })
            .skip((page - 1) * perpage)
            .limit(perpage)
        if (req.query.ajax == "true")
            res.json({
                cat: req.session.categoryName,
                products: products,
                productCount: productCount,
                page: page,
                count: count,
            })
        else if (products) {
            res.render("frontEnd/shop-grid-left", {
                categories,
                products,
                cart_products,
                count,
                cat: req.session.categoryName,
                page,
                wish_list,
            })
        }
        // If it's a regular request, render the entire page
        else res.send('<script>alert("Something went wrong")</script>')
    } catch (error) {
        console.log(error.message)
    }
}
const productImageDelete = async (req, res) => {
    try {
        const product_id = req.query.id
        const imageIndex = parseInt(req.query.index, 10)
        const product = await productModel.findById(product_id)
        const productImage = product.productImage
        const imageDelete = await productModel.updateOne(
            { _id: product_id },
            { $pull: { productImage: productImage[imageIndex] } }
        )
        if (imageDelete) res.json({ response: "deleted" })
        else res.json({ response: "error" })
    } catch (error) {
        console.log(error.message)
    }
}
const provideDiscount = async (req, res) => {
    try {
        const category_id = req.query.id
        const category = await categoryModel.findById(category_id)
        res.json({ discount: category.discount, success: true })
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    viewProducts,
    deleteProduct,
    insertProduct,
    editProduct,
    editingProduct,
    loadAddProduct,
    productDetails,
    showAllProducts,
    viewProductPagination,
    productImageDelete,
    provideDiscount,
}
