/*jshint esversion: 6 */
//'use strict'
//Requires

var express = require('express');

//var helmet = require('helmet');

var mongoose = require('mongoose');

mongoose.set('strictQuery', false);

var bodyParser = require('body-parser');

var requestIp = require('request-ip');

const cors = require('cors');
const path = require('path');

var fs = require('fs');

const data = require('./config/data.json');

//const uri = "mongodb://0.0.0.0:27017/";
//const client = new MongoClient(uri);

//Inicializar variables
var app = express();
//require('./config/otros/connection');

//middlewares
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestIp.mw());

//app.use(helmet());



//static files
app.use(express.static(path.join(__dirname, './uploads')));

//routes
//app.use(require('./routes/uploadImage'));


//cors
//const express = require("express");
//const app = express();

//const cors = require("cors");

//const corsOptions = {
//origin: ['http://localhost:62521'],
// optionsSuccessStatus: 200, // some legacy browsers     (IE11, various SmartTVs) choke on 204
//};
//app.use(cors(corsOptions)); // CORS policy

app.use(function(req, res, next) {
    res.set({
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': '*',
        // 'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS'

        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    // res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));



//Importar Rutas
var appRoutes = require('./routes/app');

var UsuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//var hospitalRoutes = require('./routes/hospital');
//var medicoRoutes = require('./routes/medico');

var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//var subirRoutes = require('./routes/subir');

//var imageRoute = require('./routes/imageRoute');

var PaginiRoutes = require('./routes/pagini');

var PaginRoutes = require('./routes/pagin');

var VisitaRoutes = require('./routes/visita');

var CorreoRoutes = require('./routes/correo');

var UrlsRoutes = require('./routes/urls');

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://0.0.0.0:27017/museoDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});


/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node-file-upl', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;*/


//Serve Index Config
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'));
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


//Rutas   
app.use('/urls', UrlsRoutes);

app.use('/correo', CorreoRoutes);

app.use('/pagini', PaginiRoutes);
app.use('/pagin', PaginRoutes);

app.use('/visitas', VisitaRoutes);

app.use('/usuario', UsuarioRoutes);
//app.use('/hospital', hospitalRoutes);
//app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);

app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

//app.use('/', subirRoutes);



//app.use('/uploadphoto', imageRoute);

app.use('/login', loginRoutes);

app.use('/', appRoutes);

//Escuchar peticiones
//app.listen(81, data.URL_BACKEND, (err) => {
app.listen(81, (err) => {
    if (err) {
        console.log(`hay un error ${err}`);
    } else {
        console.log('Express Server puerto 81: \x1b[32m%s\x1b[0m', 'online');
    }
});