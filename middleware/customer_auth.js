const is_User = (req, res, next) => {
  
    if (req.session && req.session.User) next()
    else{
      console.log("not logined")
       res.redirect("/login")
//res.json({login:"no"})
    }
}
module.exports = is_User
