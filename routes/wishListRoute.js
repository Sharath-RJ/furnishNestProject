const wishlistController=require("../controller/wishlistController")
const is_User = require("../middleware/customer_auth")
const is_Blocked = require("../middleware/customer_block")
var express = require("express")
var router = express.Router()
router.get("/addToWishList",is_User,is_Blocked, wishlistController.addToWishList)
router.get("/removeWishList",is_User,is_Blocked, wishlistController.removeWishList)
router.get("/viewWishList",is_User,is_Blocked, wishlistController.viewWishList)
module.exports=router
