/*jshint esversion: 6 */
var express = require('express');

var app = express();

var fs = require('fs');

// Ruta para leer el archivo JSON
app.get('/', (req, res) => {
    fs.readFile('./config/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo JSON');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

module.exports = app;