
var mongoose = require('mongoose');

const productosCollection='productos'
const productosSchema = new mongoose.Schema({

    nombre:{type:String,require:true},
    descripcion:{type:String,require:true},
    url: {type:String, require:true},
    precio:{type:Number,require:true},
    stock:{type:Number,require:true}

})

module.exports = mongoose.model(productosCollection,productosSchema)
