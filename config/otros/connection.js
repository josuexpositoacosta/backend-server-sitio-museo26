/*jshint esversion: 6 */
// 'use strict'
var mongoose = require("mongoose");

var { mongoDB } = require("./URI");

mongoose.connect(mongoDB.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('Base de Datos para imagenes en:  \x1b[32m%s\x1b[0m', 'online ok'))
    .catch(err => console.log(`Error BD: ${err}`))