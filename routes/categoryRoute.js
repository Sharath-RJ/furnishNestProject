const categoryControler=require("../controller/categoeyControler")
const categoryUpload = require("../middleware/category_multer")
var express = require("express")
var router = express.Router()
const is_Admin = require("../middleware/admin_auth")

router.get("/editCategory",is_Admin, categoryControler.editCategory)
router.post(
    "/updateCategory",
    is_Admin,
    categoryUpload.single("categoryImage"),
    categoryControler.updateCategory
)
router.get("/unlistCategory", is_Admin, categoryControler.deleteCategory)
router.get("/listCategory", is_Admin, categoryControler.listCategory)
router.get("/categoryAdd", is_Admin, categoryControler.loadCategoryPage)
router.post(
    "/createCategory",
    is_Admin,
    categoryUpload.single("categoryImage"),
    categoryControler.createCategory
)
module.exports=router