const is_Admin = (req, res, next) => {
    if (req.session && req.session.Admin){
       next()
    }
    else res.redirect("/admin")
}
module.exports = is_Admin
