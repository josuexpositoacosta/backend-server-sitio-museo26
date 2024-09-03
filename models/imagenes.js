//const mongoose = require("../database");

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var imageSchema = new mongoose.Schema({
    nombre: { type: String, require: [true, 'El nombre es necesario'] },
    //desc: String,
    //img: { type: String, require: false },
    img: { data: Buffer, contentType: String }
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Imagenes', imageSchema);