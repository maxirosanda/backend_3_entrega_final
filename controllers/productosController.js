const Producto = require('../models/productos');
const Mensaje = require('../models/mensajes');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const fs = require('fs')
const path =require('path')

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.agregar = async (req, res, next) => {

 try{
  producto = await Producto.find({}).lean()
  await res.render("agregarProducto", {productos: producto})
}
catch (e) { console.log(e) } 
}

 exports.getProductos = async (req, res, next) => {
  try{
     producto = await Producto.find({}).lean()
     let comprador =JSON.stringify(req.user)
     comprador = JSON.parse(comprador)
     await res.render("productos", {productos:producto,comprador:comprador,foto_usuario:req.user.foto}) 
  }
  catch (e) { console.log(e) } 
  }


 exports.getProducto = async (req, res, next) => {
    let id = req.params.id;
    
    try{
       producto = await Producto.find({_id: id}).lean()
       mensaje = await Mensaje.find({articulo: id}).lean()
       await res.render(`producto`, {producto: producto,mensaje:mensaje}) 
    }
    catch (e) { console.log(e) } 
    }

  exports.createProductos = async (req, res, next) => {  
    try{
      let EDFile = req.files.url
      req.body.url = req.body.nombre + makeid(10) + ".png"
      producto = new Producto(req.body)
      await producto.save()
      EDFile.mv(`./public/img/productos/${req.body.url}`,err => {
          if(err) return res.status(500).send({ message : err })
          res.redirect("/agregar") 
          })
         
    }
  catch (e) { console.log(e) }
}
exports.updateProducto = async (req, res, next) => { 
  
  let id = req.params.id;
  const {nombre,codigo,descripcion,precio,urldos,stock}=req.body
  let EDFile
  if(req.files) EDFile = req.files.url
  let nuevoproducto={}
  if(nombre) nuevoproducto.nombre=nombre
  if(codigo) nuevoproducto.codigo=codigo
  if(descripcion) nuevoproducto.descripcion=descripcion
  if(EDFile) {
    EDFile.mv(`./public/img/productos/${urldos}`,err => {
      if(err) return res.status(500).send({ message : err })
      res.redirect("/agregar") 
      })
  } 
  if(precio) nuevoproducto.precio=precio
  if(stock) nuevoproducto.stock= stock

  try{
    let producto = await Producto.findOneAndUpdate(
    {_id: id},
    {$set:nuevoproducto},
    {new:true}
    )
    await res.redirect("/agregar")   
  }
  catch (e) { console.log(e) }

  },

  exports.deleteProductos = async (req, res, next) => {
    let id = req.params.id;
    try{
      fs.unlinkSync(path.join("public/img/productos/", req.body.url))
      producto = await  Producto.deleteOne({_id: id})
      await res.redirect("/agregar") 
    }
     catch (e) { console.log(e) } 

}
