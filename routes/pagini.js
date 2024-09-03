/*jshint esversion: 6 */
var express = require('express');
//var bcryp = require('bcryptjs');

const pagini = require('../models/pagini');

//var jwt = require('jsonwebtoken');

//suponiendo que estas usando express como back solicitarias que esa data te llegue así
//let encriptado = encodeURIComponent("testíon");
//console.log(encriptado);


var app = express();

var Pagini = require('../models/pagini');

//obtener todos los paginis 

app.get('/', (req, res, next) => {
    //var desde = req.query.desde || 0;
    //desde = Number(desde); 

    Pagini.find({}, 'nombreeventopro informacion detalle fecha img usuario role ')
        // .skip(desde)  //.limit(5)
        .exec(
            (err, paginis) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando paginis',
                        errors: err
                    });
                }
                Pagini.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        paginis: paginis,
                        total: conteo
                    });
                });
            });
});

//obtener todos los paginis con limite 5 

app.get('/desde/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Pagini.find({}, 'nombreeventopro informacion detalle fecha img usuario role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, paginis) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando paginis',
                        errors: err
                    });
                }
                Pagini.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        paginis: paginis,
                        total: conteo
                    });
                });
            });
});

//actualizar pagini
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Pagini.findById(id, (err, pagini) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar ',
                errors: err
            });
        }

        if (!pagini) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Pagini con el id ' + id + ' no existe',
                errors: { message: 'No existe un Pagini con ese ID' }
            });
        }

        pagini.nombreeventopro = body.nombreeventopro;
        pagini.informacion = body.informacion;
        pagini.usuario = body.usuario,
            pagini.detalle = body.detalle;
        pagini.fecha = body.fecha;
        pagini.role = body.role;

        pagini.save((err, paginiGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar pagini',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                pagini: paginiGuardado
            });


        });


    });


});

//crear un nuevo pagini
app.post('/',
    (req, res) => {

        var body = req.body;

        var pagini = new Pagini({
            nombreeventopro: body.nombreeventopro,
            informacion: body.informacion,
            usuario: body.usuario,
            role: body.role,
            // img: body.img,
        });

        pagini.save((err, paginiGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear pagini',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                pagini: paginiGuardado
            });
        });
    });

//borrar  pagini por id
app.delete('/:id',

    (req, res) => {

        var id = req.params.id;

        Pagini.findByIdAndRemove(id, (err, paginiBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar pagini',
                    errors: err
                });
            }

            if (!paginiBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe pagini con ese id',
                    errors: { message: 'No existe pagini con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                pagini: paginiBorrado
            });

        });

    });



module.exports = app;