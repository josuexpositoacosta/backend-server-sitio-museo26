//const { time, timeStamp } = require('console');
//import { Time } from "@angular/common";
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['EVENTO', 'ACTIVIDAD', 'NOTICIA'],
    message: '{VALUE} no es un rol permitido'
};

var paginiSchema = Schema({
    nombreeventopro: { type: String, require: [true, 'El nombre evento pro es necesario'] },
    informacion: { type: String, require: [true, 'informacion es necesario'] },

    detalle: { type: String, require: false },
    fecha: { type: Date, require: false },
    // hora: { type: time, require: false },
    img: { type: String, require: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    role: {
        type: String,
        require: true, //enum: rolesValidos  
    }

});


module.exports = mongoose.model('Pagini', paginiSchema);