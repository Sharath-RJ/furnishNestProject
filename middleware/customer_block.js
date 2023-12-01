const is_Blocked=async(req,res,next)=>{
  if(req.session.is_block)
      res.render("backEnd/forbidden.ejs")
  else
    next()
}
module.exports=is_Blocked
