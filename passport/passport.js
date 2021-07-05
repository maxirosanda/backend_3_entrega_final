var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const User = require('../models/usuarios');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcrypt');
const config = require("../config/configFacebook");
const enviarmail = require('../utils/mail')

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const isValidPassword = function(user,password){
  return bcrypt.compareSync(password,user.password)
}
const createHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)
}

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    User.findOne({'username':username},
    function(err,user){
      if(err) return done(err)
      if(!user) return done (null,false)
      if(!isValidPassword(user,password)) return done(null,false)
      return done(null,user)
    })
    
  })
);

passport.use('register', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){ 
      User.findOne({'username':username},
      function(err,user){
        if(err) return done(err)
        if(user) {
          return done (null,false)
        }else{
          let EDFile = req.files.foto
          req.body.foto = req.body.username + makeid(10) + ".png"
          EDFile.mv(`./public/img/fotos/${req.body.foto}`,err => {
            if(err) return res.status(500).send({ message : err })})
          var newUser= new User()
          newUser.username=username
          newUser.password=createHash(password)
          newUser.mail=req.body.mail
          newUser.nombre=req.body.nombre
          newUser.direccion=req.body.direccion
          newUser.edad=req.body.edad
          newUser.pre_tel=req.body.pre_tel
          newUser.tel=req.body.tel
          newUser.foto=req.body.foto
          newUser.tipo_usuario="comprador"
          newUser.metodo= "Local"
                
          var d = new Date();
          fecha = `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getFullYear()} ${d.getUTCHours()}:${d.getUTCMinutes()}`
           enviarmail({
                    from: 'maxirosandacoder@gmail.com',
                    to: 'maxirosandacoder@gmail.com',
                    subject: `registro del usuario: ${ newUser.username} en la fecha ${fecha}`,
                    attach:`./public/img/fotos/${newUser.foto}`,
                    html: `Datos Usuario : ${ newUser.username} ,Tipo de usuario: ${ newUser.tipo_usuario}, Metodo de registro: ${ newUser.metodo} `
           })

          newUser.save(function(err){
            if(err){ throw err}
            return done(null,newUser)
          })
          
        }
      })
      
    }
    process.nextTick(findOrCreateUser);
  })
)
 
passport.use('facebook', new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: "/facebook/callback",
}, (accessToken, refreshToken, profile, done) => {

  findOrCreateUser = function(){
    User.findOne({'username':profile.displayName},
    function(err,user){
      if(err) return done(err)
      if(user) {
        return done (null,user)
      }else{
        var newUser= new User()
        newUser.username=profile.displayName
        newUser.password=createHash(profile.id)
        newUser.tipo_usuario="comprador"
        newUser.metodo= "facebook"
        newUser.save(function(err){
          if(err){ throw err}
          return done(null,newUser)
        })
        
      }
    })
    
  }
  process.nextTick(findOrCreateUser);
  
}))
 

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
   
passport.deserializeUser(function(id, done) {
    User.findById(id,function (err,user){
      done(null, user)
    })
      
});


