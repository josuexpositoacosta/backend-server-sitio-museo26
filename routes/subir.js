//import Swal from 'sweetalert2';
var express = require('express');

//import Swal from 'sweetalert2';

var fileUpload = require('express-fileupload');

var fs = require('fs');
const { URL_SERVICIOS } = require('../config/confi');
var app = express();

// default options 
app.use(fileUpload());

//app.UseHttpsRedirection();

app.post('/up', (req, res) => {
    var file = req.body.file;
    var name = req.body.name;

    //const name1 = req.body;

    //mover el archivo del temporal a un path
    var path = './uploads/slider/' + name;
    //var path = URL_SERVICIOS + '../assets/img/moncada/' + name;


    var binanyData = new Buffer(file.replace(/^data:image\/png;base64,/, ""), 'base64').toString('binary');
    fs.writeFile(path, binanyData, "binary", (err) => {

        console.log(err);
        //  Swal.fire('http', 'No Subscrito', 'error')

        res.json({ result: 'ok' });
    });


    /* file.mv(path, err => {
         if (err) {
             res.status(500).json({
                 ok: false,
                 mensaje: 'Error al mover archivo',
                 errors: err
             });
         }
     });*/



});


module.exports = app;