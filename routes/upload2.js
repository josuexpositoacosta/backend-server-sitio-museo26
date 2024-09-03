var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
var Imagenes = require('../models/imagenes');

// default options 
app.use(fileUpload());
 

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios', 'imagenes'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { Message: 'Tipo de colección no es válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { Message: 'Debe seleccionar una imagen' }
        });
    }

    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo estas extenciones aceptamos
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extención no Válida',
            errors: { Message: 'Las extenciones válidas son ' + extencionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extencionArchivo}`;

    //mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { messaje: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + nombreArchivo;

            //si existe elimina la imagen anterior           

          //  if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo)

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: { messaje: 'Médico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            //si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de médico actualizada',
                    usuario: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { messaje: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado
                });
            });
        });
    }


    if (tipo === 'imagenes') {
        Imagenes.findById(id, (err, imagen) => {

            if (!imagen) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Imagen no existe',
                    errors: { messaje: 'Imagen no existe' }
                });
            }

            //var pathViejo = './uploads/hospitales/' + imagen.img;

            //si existe elimina la imagen anterior
            //  if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            imagen.img = nombreArchivo;
            imagen.save((err, imagenActualizada) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen  actualizada',
                    usuario: imagenActualizada
                });
            });
        });
    }


}

module.exports = app;