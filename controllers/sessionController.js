
const User = require('../models/usuarios');
const loggerError = require('pino')('./logs/error.log')
module.exports = {

    vistalogin: (req,res)=>{
        res.render("login")
        
    },
    vistadatos:(req,res)=>{
        let datos = JSON.stringify(req.user)
         datos = JSON.parse(datos)
        res.render("datosPersonales",{datos:datos})
    },

    updateDatos : async (req, res, next) => { 
  
        const {username,nombre,mail,direccion,edad,pre_tel,tel,_id,fotodos}=req.body
        let EDFile
        if(req.files) EDFile = req.files.foto
        if(EDFile) {
        EDFile.mv(`./public/img/fotos/${fotodos}`,err => {
          if(err) return res.status(500).send({ message : err })})
        }

        let nuevodatos={}
        if(username) nuevodatos.username=username
        if(nombre) nuevodatos.nombre=nombre
        if(mail) nuevodatos.mail=mail
        if(direccion) nuevodatos.direccion=direccion
        if(edad) nuevodatos.edad=edad
        if(pre_tel) nuevodatos.pre_tel=pre_tel
        if(tel) nuevodatos.tel= tel
      
        try{
          let datos = await User.findOneAndUpdate(
          {_id: _id},
          {$set:nuevodatos},
          {new:true}
          )
          await res.redirect("/datos")   
        }
        catch (e) { loggerError.error(e) }
      
        },

    vistaregistro: (req,res)=>{
        res.render("registro")
    },

    login: (req, res) => {
        res.redirect("/");
    },

    register: (req, res) => {
        
        res.redirect("/agregar");
    },

    logout: async (req, res) => {
        try{
            user = await User.find({username: req.user.username}).lean()
           
            await req.session.destroy( err => {
               if(err) return err;
    
            res.redirect("/login");
            })
         }
         catch (e) { loggerError.error(e) } 
         
      
    }
}
