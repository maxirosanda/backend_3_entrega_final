const ProductosController = require('../controllers/productosController');
const CarritoController = require('../controllers/carritoController');
const PedidoController = require('../controllers/pedidoController');
const MensajesController = require('../controllers/mensajesController');
const middlewareAdmin = require('../middlewares/middlewareAdmin')
const middlewareEditor = require('../middlewares/middlewareEditor')
const middlewareComprador = require('../middlewares/middlewareComprador')
const sessionController = require('../controllers/sessionController')
const passport = require("passport");  
module.exports = app => {
  
  
  app.get("/login",sessionController.vistalogin)
  app.get("/registro",sessionController.vistaregistro)
  app.get("/logout", sessionController.logout);
  app.get("/failLogin", (req, res) => { res.send("falla al logear")});
  app.get("/failRegister", (req, res) => { res.send("falla al registrar")});
  app.post("/login", passport.authenticate('login', {failureRedirect: 'failLogin'}), sessionController.login);
  app.post("/register", passport.authenticate('register', {failureRedirect: 'failRegister'}), sessionController.register);
  
  app.get("/facebook", passport.authenticate("facebook"));
  app.get("/facebook/callback", passport.authenticate('facebook', {successRedirect: '/agregar', failureRedirect: '/login'}));
  
  app.get("/datos",middlewareComprador.auth,sessionController.vistadatos)
  app.put('/actdatos',middlewareComprador.auth,sessionController.updateDatos);

  app.get("/agregar",middlewareEditor.auth,ProductosController.agregar)
  app.get('/',middlewareComprador.auth,ProductosController.getProductos);
  app.get('/producto/:id',middlewareComprador.auth,ProductosController.getProducto);
  app.post('/productos',middlewareEditor.auth, ProductosController.createProductos);
  app.put('/productos/:id',middlewareEditor.auth, ProductosController.updateProducto);
  app.delete('/productos/:id',middlewareEditor.auth, ProductosController.deleteProductos);

  app.get('/carrito',middlewareComprador.auth, CarritoController.getCarritos);
  app.post('/carrito',middlewareComprador.auth, CarritoController.createCarrito);
  app.put('/carrito/:id',middlewareComprador.auth,CarritoController.updateCarrito);
  app.delete('/carrito/:id',middlewareComprador.auth, CarritoController.deleteCarrito);

  app.get('/comprar',middlewareComprador.auth, PedidoController.createPedido);
  app.get('/pedidos',middlewareComprador.auth, PedidoController.getPedidos);
  app.get('/pendientes', PedidoController.getPendientes);

  app.post('/mensajes',middlewareComprador.auth, MensajesController.createMensajes);
};