const profileControler=require("../controller/profileControler")
const is_User = require("../middleware/customer_auth")
var express = require("express")
const is_Blocked = require("../middleware/customer_block")
var router = express.Router()
router.get(
    "/userProfile",
    is_User,
    is_Blocked,
    profileControler.userProfileLoad
)
router.get(
    "/editUserprofile",
    is_User,
    is_Blocked,
    profileControler.editUserprofile
)
router.post(
    "/editingUserDetails",
    is_User,
    is_Blocked,
    profileControler.editUserDetails
)
router.get(
    "/addressManagement",
    is_User,
    is_Blocked,
    profileControler.addressManagement
)
router.get("/editAddress", is_User, is_Blocked, profileControler.editAddress)
router.post(
    "/editingAddress",
    is_User,
    is_Blocked,
    profileControler.editingAddress
)
router.post(
    "/changePassword",
    is_User,
    is_Blocked,
    profileControler.changeingPassword
)
router.post("/addAddress", is_User, is_Blocked, profileControler.addingAddress)
router.get(
    "/viewOrderDetails",
    is_User,
    is_Blocked,
    profileControler.showOrderDetails
)
module.exports=router
