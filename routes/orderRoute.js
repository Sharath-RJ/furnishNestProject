const orderControler=require("../controller/orderControlers")
const is_User = require("../middleware/customer_auth")
const is_Admin=require("../middleware/admin_auth")
var express = require("express")
var router = express.Router()
const is_Blocked=require('../middleware/customer_block')
router.post("/placingOrder", is_User, is_Blocked, orderControler.placingOrder)
router.get("/myOrdersView", is_User, is_Blocked, orderControler.viewMyOrders)
router.post("/cancelOrder", is_User, is_Blocked, orderControler.cancelOrder)
router.get("/addAddressLoad",is_User,is_Blocked, orderControler.addingAddressLoad)
router.post("/addingAddress", is_User, is_Blocked, orderControler.addingAddress)
router.post("/verify-payment", is_User, is_Blocked, orderControler.loadVerify)
router.get("/returnOrder", is_User, is_Blocked, orderControler.returnOrder)
router.get("/orderList",is_Admin, orderControler.orderList)
router.get("/orderDetails",is_Admin, orderControler.orderDetails)
router.get("/updateStatus",is_Admin, orderControler.updateStatus)
router.get("/returns",is_Admin, orderControler.returnOrderListing)
router.get("/returnDetails",is_Admin, orderControler.returnDetails)
router.get("/cancelDetails",is_Admin, orderControler.cancelDetails)
module.exports=router
