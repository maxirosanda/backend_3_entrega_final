var mongoose = require('mongoose');

const usuariosCollection='usuarios'
const usuariosSchema = new mongoose.Schema({

    username:{type:String,require:true},
    password:{type:String,require:true},
    mail:{type:String,require:true},
    nombre:{type:String,require:true},
    direccion:{type:String},
    edad:{type:Number},
    pre_tel:{type:Number},
    tel:{type:Number},
    foto:{type:String},
    tipo_usuario:{type:String},
    metodo:{type:String,require:true},
    foto:{type:String}

})

module.exports = mongoose.model(usuariosCollection,usuariosSchema)