
var mongoose = require('mongoose');

const mensajesCollection='mensajes'

const mensajesSchema = new mongoose.Schema({

    articulo:{type:String,require:true},
    mail:{type:String,require:true},
    mensaje:{type:String,require:true},
    time:{type:Date, default: Date.now }

})

module.exports = mongoose.model(mensajesCollection,mensajesSchema)