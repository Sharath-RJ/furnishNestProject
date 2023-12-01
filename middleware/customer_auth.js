const is_User = (req, res, next) => {
  
    if (req.session && req.session.User) next()
    else if(req.query.ajax=="true"){
    
         res.json({login:"no"})
    }else{
          res.redirect("/login")
    }
}
module.exports = is_User
