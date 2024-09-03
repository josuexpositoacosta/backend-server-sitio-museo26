var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Definir el modelo de visitas

var visitaSchema = Schema({
    ip: { type: String, require: false },
    contador: { type: Number, require: false, default: 0 },
    fecha: { type: Date, require: false },
    estado: { type: Number, require: false, default: 0 }
});


module.exports = mongoose.model('Visita', visitaSchema);