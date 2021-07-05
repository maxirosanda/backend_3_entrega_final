const Mensaje = require('../models/mensajes');
const enviarsms = require('../utils/sms')

  exports.createMensajes = async (req, res, next) => {  
      try{
        mensaje = new Mensaje(req.body)
        posicion = req.body.mensaje.indexOf("@administrador")
       if(posicion !== -1){
        enviarsms(req.body.mail,req.body.mensaje)
       }
        await mensaje.save()
        await res.redirect("/producto/" + mensaje.articulo ) 
      }
    catch (e) { console.log(e) }
  }
