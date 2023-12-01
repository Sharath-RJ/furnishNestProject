const customerModel = require("../model/Customer")
const { google } = require("googleapis")
const { OAuth2Client } = require("google-auth-library")
const categoryModel = require("../model/category")
const passport = require("passport")
const cartModel = require("../model/cartModel")
const productModel = require("../model/product")
const walletTransaction = require("../model/walletTransaction")
const bcrypt = require("bcrypt")
const twilio = require("twilio")
const wishListModel = require("../model/wishlist")
const randomString = require("randomstring")
const nodemailer = require("nodemailer")
const { promises } = require("nodemailer/lib/xoauth2")
require("dotenv").config()
const client = new OAuth2Client(
    "457397602663-ij45r13b0jaurgpujas4irm0kv6gpimq.apps.googleusercontent.com",
    "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"
)
const redirectURL = "http://localhost:3000/google/callback"
let storedOTP
const loginPage = async (req, res) => {
    try {
        if (req.session.User) {
            const user_id = req.session.userData._id
            const cart_products = await cartModel.find({ customerId: user_id })
            const wishList = await wishListModel.findOne({ userID: user_id })
            const categories = await categoryModel.find({
                list_or_unlist: true,
            })
            const products = await productModel.find({
                listOrUnlist: true,
            })
            const productsWithWishListStatus = await Promise.all(
                products.map(async (product) => {
                    let category = product.productCategory
                    let productDiscount = product.productDiscount
                    let categoryDetails = await categoryModel.findOne({
                        categoryName: category,
                    })
                    let categoryDiscount = categoryDetails.discount
                    product.discount = Math.max(
                        productDiscount,
                        categoryDiscount
                    )
                    product.isInWishList =
                        wishList?.products?.includes(product._id) || false

                    return product
                })
            )
            const referalCodeAvailable = await customerModel.find({
                referalCode: req.session.referalCode,
            })
            if (req.session.referalCode && referalCodeAvailable.length > 0) {
                // Update the referred user's wallet
                await customerModel.updateOne(
                    { _id: req.session.userData._id },
                    { $inc: { wallet: 50 } }
                )
                // Log the wallet transaction for the referred user
                await new walletTransaction({
                    userId: req.session.userData._id,
                    type: "credit",
                    amount: 50,
                }).save()
                req.session.referalCode = false
            }
            const userName = req.session.userData.firstName
            console.log(userName)
            res.render("frontEnd/index-4", {
                categories,
                cart_products,
                products: productsWithWishListStatus,
                wish_list: wishList || { products: [] },
                user: userName,
                // Provide a default empty wish list if wishList is null
            })
        } else {
            //const user_id = req.session.userData._id
            const cart_products = []
            const wishList = []
            const categories = await categoryModel.find({
                list_or_unlist: true,
            })
            const products = await productModel.find({
                listOrUnlist: true,
            })
            const productsWithWishListStatus = await Promise.all(
                products.map(async (product) => {
                    let category = product.productCategory
                    let productDiscount = product.productDiscount
                    let categoryDetails = await categoryModel.findOne({
                        categoryName: category,
                    })
                    let categoryDiscount = categoryDetails.discount
                    product.discount = Math.max(
                        productDiscount,
                        categoryDiscount
                    )
                    product.isInWishList =
                        wishList?.products?.includes(product._id) || false

                    return product
                })
            )
            console.log(productsWithWishListStatus)

            res.render("frontEnd/index-4", {
                categories,
                cart_products,
                products: productsWithWishListStatus,
                wish_list: wishList || { products: [] },
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const registerLoad = (req, res) => {
    try {
        res.render("frontEnd/register.ejs")
    } catch (error) {
        console.log(error.message)
    }
}
const sendingOTP = (req, res) => {
    try {
        const message = req.query.msg
        const data = req.session.temp
        res.render("frontEnd/page-otp")
        const accountSid = "ACa046474223677b94f730ff32a7f020dd"
        const authToken = "fc9b714e0a517fede19249c347523769"
        const client = new twilio(accountSid, authToken)
        const fromPhoneNumber = "+12402977901"
        const toPhoneNumber = "+91" + data.phone
        var Otp = Math.floor(1000 + Math.random() * 9000)
        storedOTP = Otp
        client.messages
            .create({
                body: `Your varification code is : ${Otp}`,
                from: fromPhoneNumber,
                to: toPhoneNumber,
            })
            .then(() => console.log(`Message sent successfully:`))
            .catch((e) => console.error(`Error sending message:${e}`))
    } catch (error) {
        console.log(error.message)
    }
}
const loadLoginPage = (req, res) => {
    try {
        res.render("frontEnd/login.ejs")
    } catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res) => {
    try {
        const { n1, n2, n3, n4 } = req.body
        const receivedOTP = n1 + n2 + n3 + n4
        if (receivedOTP == storedOTP) {
            const userData = req.session.temp
            const { firstName, lastName, email, phone, password, referalCode } =
                userData
            if (referalCode) req.session.referalCode = referalCode
            const hashedPassword = await bcrypt.hash(password, 10)
            const newuser = new customerModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: hashedPassword,
                is_active: false,
                is_block: false,
                is_varified: false,
                referalCode: generateRandomCode(6),
            })
            await newuser.save()
            req.session.is_block = true
            res.render("frontEnd/page-login-register", {
                success: "Registered Successfully Now Login",
            })
        } else {
            res.redirect('/sendingOTP?msg="Otp Not Matching"')
        }
    } catch (error) {
        console.log(error.message)
        res.send('<script>alert("Something went wrong")</script>')
    }
}
function generateRandomCode(length) {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        result += charset.charAt(randomIndex)
    }
    return result
}
const insertingUser = (req, res) => {
    try {
        req.session.temp = req.body
        res.redirect("/sendingOTP")
    } catch (error) {
        console.log(error.message)
    }
}
const sendingOtpAgain = (req, res) => {
    try {
        res.redirect("/sendingOTP")
    } catch (error) {
        console.log(error)
    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const customer = await customerModel.findOne({ email: email })
        if (customer) {
            //storing user data in session
            req.session.userData = customer
            const matchPassword = await bcrypt.compare(
                password,
                customer.password
            )
            if (matchPassword) {
                req.session.User = true
                res.redirect("/")
            } else {
                res.render("frontEnd/login", {
                    message: "Password is incorrect",
                })
            }
        } else {
            res.render("frontEnd/login", {
                message: "Email is incorrect",
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const userLogout = (req, res) => {
    try {
        console.log(req.session.User)
        if (req.session.User) {
            req.session.User = false
            res.render("frontEnd/login")
        } else {
            console.log("Error occured")
        }
    } catch (error) {
        console.log(error.messages)
    }
}
const forgotPasswordLoad = async (req, res) => {
    try {
        res.render("frontEnd/forgot-password")
    } catch (error) {
        console.log(error.message)
    }
}
const sendResetPasswordMail = async (name, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "kerdostech@gmail.com",
                pass: "cdap dbiq vrkw skds",
            },
        })
        const mailOptions = {
            from: "kerdostech@gmail.com",
            to: email,
            subject: "Test Email",
            html: `
    <P>HI ${name} Click the link to reset your password</P>
    <div class="timer">
      <p>Your password reset link will expire in:</p>
      <p id="time">5:00</p>
      <a href="http://localhost:${process.env.PORT}/resetPassword" id="link">Click here to reset your password</a>
    </div>
  `,
        }
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error)
            } else {
                console.log("Email sent: " + info.response)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const userFound = await customerModel.findOne({ email: email })
        if (userFound) {
            req.session.email = email
            sendResetPasswordMail(userFound.firstName, userFound.email)
            req.session.expiryTime = new Date().getMinutes() + 5
            res.json({ response: "Success" })
        } else res.json({ response: "Failed" })
    } catch (error) {
        console.log(error.message)
    }
}
const verifyUserResetPassword = async (req, res) => {
    try {
        const { n1, n2, n3, n4 } = req.body
        const receivedOTP = n1 + n2 + n3 + n4
        if (storedOTPForgotPass == receivedOTP) res.render("")
        else res.send("not verified")
    } catch (error) {
        console.log(error.message)
    }
}
const resetPassword = async (req, res) => {
    try {
        const email = req.session.email
        const { password } = req.body
        const userFound = await customerModel.find({ email: email })
        if (userFound) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const passUpdate = await customerModel.updateOne(
                { email: email },
                { $set: { password: hashedPassword } }
            )
            if (passUpdate.modifiedCount == 1)
                res.render("frontEnd/page-login-register", {
                    success: "Password reset Successfully ! now login",
                })
            else
                res.render("frontEnd/page-login-register", {
                    message: "Something went wrong",
                })
        } else {
            res.render("frontEnd/page-login-register", {
                message: "Link expired try again",
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const resetPasswordLoad = (req, res) => {
    try {
        let currentTime = new Date().getMinutes()
        if (req.session.expiryTime && req.session.expiryTime > currentTime)
            res.render("frontEnd/reset-password")
        else
            res.render("frontEnd/page-login-register", {
                message: "Link expired try again",
            })
    } catch (error) {
        console.log(error.message)
    }
}
const search = async (req, res) => {
    try {
        const { searchItem } = req.body
        if (!searchItem) {
            return res.status(400).json({ error: "Search query is missing." })
        }
        const results = await productModel.find({
            $or: [
                { productCategory: { $regex: new RegExp(searchItem, "i") } },
                { productName: { $regex: new RegExp(searchItem, "i") } },
            ],
        })
        res.render("frontEnd/searchResult", { results })
    } catch (error) {
        console.log(error.message)
    }
}
const googleAuth = (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email", // Include this scope for email access
        ],
        redirect_uri: redirectURL,
    })
    res.redirect(authUrl)
}
const googleAuthSuccess = async (req, res) => {
    // Check if the user is authenticated
    if (req.session.tokens) {
        try {
            // Use the obtained tokens to create an OAuth2 client
            const oauth2Client = new OAuth2Client(
                "457397602663-ij45r13b0jaurgpujas4irm0kv6gpimq.apps.googleusercontent.com",
                "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"
            )
            // Set the credentials using the stored tokens
            oauth2Client.setCredentials(req.session.tokens)
            // Get user information
            const userInfo = await google
                .oauth2("v2")
                .userinfo.get({ auth: oauth2Client })
            // Access user's email
            const userEmail = userInfo.data.email
            // Respond to the client
            res.send(
                `Successfully logged in with Google. User email: ${userEmail}`
            )
        } catch (error) {
            console.error("Error getting user information:", error)
            res.redirect("/")
        }
    } else {
        // Redirect to the home page if not authenticated
        res.redirect("/")
    }
}
const googleCallback = async (req, res) => {
    const { code } = req.query
    try {
        const tokenResponse = await client.getToken({
            code,
            redirect_uri: redirectURL, // Specify the redirect URL here as well
        })
        const tokens = tokenResponse.tokens
        client.setCredentials(tokens)
        // You can store the tokens in the session or database as needed
        req.session.tokens = tokens
        res.redirect("/success")
    } catch (error) {
        console.error("Error getting tokens:", error)
        res.redirect("/")
    }
}
module.exports = {
    loginPage,
    userLogin,
    insertingUser,
    sendingOTP,
    insertUser,
    userLogout,
    sendingOtpAgain,
    forgotPasswordLoad,
    forgotPassword,
    verifyUserResetPassword,
    resetPassword,
    resetPasswordLoad,
    search,
    googleAuth,
    googleAuthSuccess,
    googleCallback,
    loadLoginPage,
    registerLoad,
}
