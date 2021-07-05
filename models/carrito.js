var mongoose = require('mongoose');

const carritosCollection='carritos'
const carritosSchema = new mongoose.Schema({

    nombre:{type:String,require:true},
    descripcion:{type:String,require:true},
    codigo:{type:String,require:true},
    url: {type:String, require:true},
    precio:{type:Number,require:true},
    cant_compra : {type:Number,require:true},
    id_comprador:{type:String} 

})

module.exports = mongoose.model(carritosCollection,carritosSchema)
