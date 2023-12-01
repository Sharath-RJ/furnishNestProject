const is_User = require("../middleware/customer_auth")
var express = require("express")
var router = express.Router()
const productControler = require("../controller/productControler")
const is_Admin = require("../middleware/admin_auth")
const upload = require("../middleware/multer")
const is_Blocked = require("../middleware/customer_block")
router.get("/viewProductPagination", productControler.viewProductPagination)
router.get("/productImageDelete", is_Admin, productControler.productImageDelete)
router.get("/provideDiscount", is_Admin, productControler.provideDiscount)
router.get("/addProduct", is_Admin, productControler.loadAddProduct)
router.post(
    "/addProduct",
    upload.array("productImage"),
    is_Admin,
    productControler.insertProduct
)
router.get("/editProduct", is_Admin, productControler.editProduct)
router.post(
    "/editProduct",
    upload.array("productImage"),
    is_Admin,
    productControler.editingProduct
)
router.get("/viewProducts", is_Admin, productControler.viewProducts)
router.get("/delete", is_Admin, productControler.deleteProduct)
router.get(
    "/productDetails",
    is_Blocked,
    productControler.productDetails
)
router.get(
    "/AllProduct_Category",
    is_Blocked,
    productControler.showAllProducts
)
module.exports = router
