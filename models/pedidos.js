var mongoose = require('mongoose');

const pedidosCollection='pedidos'
const pedidosSchema = new mongoose.Schema({
    id_comprador:{type:String,require:true},
    id_vendedor:{type:String,require:true},
    estado:{type:Boolean},
    productos:{type:Array},
    importe:{type:Number},
    datos_comprador:{type:Array}
})

module.exports = mongoose.model(pedidosCollection,pedidosSchema)
