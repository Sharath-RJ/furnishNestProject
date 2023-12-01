var createError = require("http-errors")
var express = require("express")
const session = require("express-session")
var path = require("path")
require("dotenv").config()
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const atlas_url = process.env.atlasURL
mongoose.connect(atlas_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection
db.on("error", () => console.log("Error while connecting"))
db.once("open", () => console.log("Connected successfully"))
var adminRouter = require("./routes/adminRoute")
var usersRouter = require("./routes/userRoute")
var cartRouter = require("./routes/cartRoute")
var categoeyRouter = require("./routes/categoryRoute")
var productRouter = require("./routes/productRoute")
var profileRouter = require("./routes/profileRoute")
var orderRouter = require("./routes/orderRoute")
var wishListRouter = require("./routes/wishListRoute")
var couponRouter=require("./routes/couponRoute")
var app = express()
const userSessionConfig = {
    name: "userSession",
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 360000000 },
}
app.use("/", session(userSessionConfig))
// view engine setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate")
    next()
})
app.use("/", usersRouter)
app.use("/admin", adminRouter)
app.use("/cart", cartRouter)
app.use("/admin/category", categoeyRouter)
app.use("/admin/product", productRouter)
app.use("/product", productRouter)
app.use("/profile", profileRouter)
app.use("/admin/order", orderRouter)
app.use("/order", orderRouter)
app.use("/admin/coupon",couponRouter)
app.use("/coupon",couponRouter)
app.use("/wishList", wishListRouter)
app.get("*", (req, res) => {
    res.render("PageNotFound")
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}
    // render the error page
    res.status(err.status || 500)
    res.render("error")
})



const debug = require('debug')('ecommerce-project:server');
const http = require("http")

const port = normalizePort(process.env.PORT || "3000")
app.set('port', port);

const server = http.createServer(app)


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



module.exports = app
