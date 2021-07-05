exports.auth =(req,res,next)=>{
    if(req.isAuthenticated()) {
    if(req.user.tipo_usuario=="comprador" req.user.tipo_usuario=="admin" ){
        next()
    }else{
        res.redirect("/login") 
    }
    } else {
     res.redirect("/login")
}}