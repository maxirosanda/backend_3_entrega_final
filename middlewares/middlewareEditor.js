exports.auth =(req,res,next)=>{
    if(req.isAuthenticated()) {
    if(req.user.tipo_usuario=="editor" || req.user.tipo_usuario=="admin" ){
        next()
    }else{
        res.redirect("/") 
    }
    } else {
     res.redirect("/")
}}