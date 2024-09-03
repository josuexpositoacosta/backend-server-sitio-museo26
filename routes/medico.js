var express = require('express');


var mdAutenticacion = require('../middlewares/autenticacion');
const medico = require('../models/medico');

var app = express();

var Medico = require('../models/medico');

//obtener todos los Medicos

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, Medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Médico',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        Medicos: Medicos,
                        total: conteo
                    });
                });
            });
});



//actualizar Médico
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, Medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Médico',
                errors: err
            });
        }

        if (!Medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Médico con el id ' + id + ' no existe',
                errors: { message: 'No existe un Médico con ese ID' }
            });
        }

        Medico.nombre = body.nombre;
        Medico.usuario = req.usuario._id;
        Medico.hospital = body.hospital;


        Medico.save((err, MedicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: MedicoGuardado
            });


        });


    });


});

//crear un nuevo Medico
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

//borrar un Medico por id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, MedicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico',
                errors: err
            });
        }

        if (!MedicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un Medico con ese id',
                errors: { message: 'No existe un Medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            Medico: MedicoBorrado
        });

    });

});



module.exports = app;