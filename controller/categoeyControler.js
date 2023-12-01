const { response } = require("express")
const categoryModel = require("../model/category")
const productModel = require("../model/product")
const loadCategoryPage = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        res.render("backEnd/page-categories", { categories })
    } catch (error) {
        console.log(error.message)
    }
}
const createCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body
        const alreadyExists = await categoryModel.find({
            categoryName: categoryName,
        })
        if (alreadyExists.length !== 0)
            res.send(
                '<script>alert("Category already exists");window.location.href="/admin/category"</script>'
            )
        else {
            const newCategory = new categoryModel({
                categoryName: categoryName,
                categoryDescription: categoryDescription,
                categoryImage: req.file.filename,
                list_or_unlist: true,
                discount:
                    req.body.categoryDiscount !== ""
                        ? req.body.categoryDiscount
                        : 0,
            })
            newCategory
                .save()
                .then(() => res.redirect("/admin/category/category"))
                .catch(() =>
                    res.send('<script>alert("Something went wrong")</script>')
                )
        }
    } catch (error) {
        console.log(error.message)
    }
}
const editCategory = async (req, res) => {
    try {
        const category_id = req.query.id
        const category = await categoryModel.findById(category_id)
        res.render("backEnd/category-edit", { category })
    } catch (error) {
        console.log(error.message)
    }
}
const updateCategory = async (req, res) => {
    try {
        const category_id = req.body.category_id
        const updatedInfo = req.body
        if (req.file) updatedInfo.categoryImage = req.file.filename
        const update = await categoryModel.findByIdAndUpdate(
            category_id,
            updatedInfo
        )
        if (update) res.redirect("/admin/category")
        else res.send('<script>alert("Something went wrong")</script>')
    } catch (error) {
        console.log(error.message)
    }
}
const deleteCategory = async (req, res) => {
    const category_id = req.query.id
    const category = await categoryModel.findById(category_id)
    const category_name = category.categoryName
    await categoryModel
        .findByIdAndUpdate(category_id, { $set: { list_or_unlist: false } })
        .then(async () => {
            await productModel
                .updateMany(
                    { productCategory: category_name },
                    { $set: { listOrUnlist: false } }
                )
                .then(() => res.json({ response: "unlisted" }))
                .catch((err) => console.log(err))
            // res.json({response:"unlisted"})
        })
        .catch((err) => console.log(err))
}
const listCategory = async (req, res) => {
    try {
        const category_id = req.query.id
        const category = await categoryModel.findById(category_id)
        const category_name = category.categoryName
        await categoryModel
            .findByIdAndUpdate(category_id, { $set: { list_or_unlist: true } })
            .then(async () => {
                await productModel
                    .updateMany(
                        { productCategory: category_name },
                        { $set: { listOrUnlist: true } }
                    )
                    .then(() => res.json({ response: "listed" }))
                    .catch((err) => console.log(err))
                // res.json({ response: "listed" })
            })
            .catch((err) => console.log(err))
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadCategoryPage,
    createCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    listCategory,
}
