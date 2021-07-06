const Carrito = require('../models/carrito');
const Pedido =require('../models/pedidos');
const enviarmail = require('../utils/mail')
const enviarwhatsapp = require('../utils/whatsapp')
const enviarsms = require('../utils/sms')
const loggerError = require('pino')('./logs/error.log')
const loggerWarn = require('pino')('./logs/warn.log')
exports.getPedidos = async (req, res, next) => {
  try{
    
    pedidos = await Pedido.find({id_comprador: req.user._id}).lean() 
    await res.render("mispedidos", {pedidos:pedidos}) 
  }
  catch (e) { loggerError.error(e) } 
  }

  exports.getPendientes = async (req, res, next) => {
    try{
      
      pendientes = await Pedido.find({}).lean()
      loggerWarn.warn(pendientes)
      await res.render("pendientes", {pendientes:pendientes}) 
    }
    catch (e) {  loggerError.error(e) } 
    }

exports.createPedido = async (req, res, next) => {  
  try{
    let encontrados = await Carrito.find({id_comprador:req.user._id}).lean() 
    if(!(Object.entries(encontrados).length === 0))
    { 
      let total=0
      encontrados.forEach(element =>{
        total += element.cant_compra * element.precio
      });
          let json = {"id_comprador":encontrados[0].id_comprador,"id_vendedor":"no asignado","estado":false,"productos":encontrados,"datos_comprador":req.user,"importe":total}
          pedido = new Pedido(json)
          await pedido.save()

          var d = new Date();
          fecha = `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getFullYear()} ${d.getUTCHours()}:${d.getUTCMinutes()}`
           enviarmail({
                    from: 'maxirosandacoder@gmail.com',
                    to: 'maxirosandacoder@gmail.com',
                    subject: `pedido pendiente del comprador con id: ${encontrados[0].id_comprador} en la fecha ${fecha}`,
                    html: `<a href="http://localhost:8080/pendientes" class="btn btn-success">Pendientes</a>`
           })
           enviarwhatsapp(encontrados[0].id_comprador,`<a href="http://localhost:8080/pendientes" class="btn btn-success">Pendientes</a>`)
           enviarsms("su pedido esta en proceso gracias por la compra")
          await  Carrito.deleteMany({id_comprador:encontrados[0].id_comprador})
          await res.render("pedido", {pedido:pedido})  

    }else
    {
      await res.redirect("/")
    }
    
  }
catch (e) {  loggerError.error(e) }
}

