/*jshint esversion: 6 */
var express = require('express');


//var requestIp = require('request-ip');




var app = express();

var Visita = require('../models/visita');


// Ruta para obtener el contador de visitas
// app.get('/visitas', async (req, res) => {
//     try {
//         var visitas = await Visita.findOne();
//         res.json(visitas);
//     } catch (err) {
//         console.error('Error al obtener el contador de visitas', err);
//         res.status(500).json({ error: 'Error al obtener el contador de visitas' });
//     }
// });
// app.get('/', function(req, res) {
//     Visita.findOne(function(err, visitas) {
//         if (err) {
//             console.error('Error al obtener el contador de visitas', err);
//             return res.status(500).json({ error: 'Error al obtener el contador de visitas' });
//         }

//         res.json(visitas);
//     });
// });
////////////////////////////////
//  Metodo Get Visita        // 
//////////////////////////////
app.get('/', (req, res, next) => {

    Visita.find({}, )
        .exec(
            (err, visitas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando visita',
                        errors: err
                    });
                }
                Visita.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        visitas: visitas,
                        total: conteo
                    });
                });
            });
});
// Ruta para incrementar el contador de visitas
// app.post('/visitas', async (req, res) => {
//     try {
//         var visitas = await Visita.findOne();
//         visitas.contador++;
//         await visitas.save();
//         res.json(visitas);
//     } catch (err) {
//         console.error('Error al incrementar el contador de visitas', err);
//         res.status(500).json({ error: 'Error al incrementar el contador de visitas' });
//     }
// });


function compararFechas(fecha1, fecha2) {
    // Convertir las fechas a objetos Date
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);
    // Comparar los valores de año, mes y día de las fechas
    var sonIguales = date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    return sonIguales;
}


app.post('/', function(req, res) {
    // Obtener la dirección IP del cliente
    var ip = req.clientIp;

    // Obtener la fecha actual
    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Buscar la dirección IP en la base de datos
    Visita.findOne({ ip: ip })
        .sort({ fecha: -1 }) // Ordenar por fecha en orden descendente
        .limit(1) // Limitar a 1 documento
        .exec(function(err, visita) {
            if (err) {
                console.error('Error al buscar la visita', err);
                return res.status(500).json({ error: 'Error al buscar la visita' });
            }

            // Aquí tienes el último documento que coincide con el criterio de búsqueda
            if (visita) {
                // La dirección IP ya existe
                var fechaVisita = new Date(visita.fecha);
                fechaVisita.setHours(0, 0, 0, 0);


                // console.error('fechaVisita ' + fechaVisita);
                //console.error('fechaActual ' + fechaActual);

                if (compararFechas(fechaVisita, fechaActual)) {
                    // La visita ya existe hoy, no hacer nada

                    return res.json(visita);
                } else { //if (!compararFechas(fechaVisita, fechaActual)) {
                    // Es una visita nueva hoy, actualizar la fecha de la visita existente
                    if (visita.estado == 0) {
                        var nVisita = new Visita({
                            ip: ip,
                            contador: 1,
                            fecha: fechaActual,
                            estado: 0
                        });
                        nVisita.save((err, visitaNueva) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error al actualizar visitaNueva',
                                    errors: err
                                });
                            }
                            res.status(201).json({
                                ok: true,
                                visita: visitaNueva
                            });
                        });
                    }
                }
            } else {
                // La dirección IP no existe, crear una nueva visita
                var nuevaVisita = new Visita({
                    ip: ip,
                    contador: 1,
                    fecha: fechaActual,
                    estado: 0
                });
                nuevaVisita.save(function(err, visitaNueva) {
                    if (err) {
                        console.error('Error al crear la visita', err);
                        return res.status(500).json({ error: 'Error al crear la visita' });
                    }
                    return res.json(visitaNueva);
                });
            }
        });
});


app.get('/visitasDiarias', function(req, res) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Buscar todas las visitas diarias
    Visita.countDocuments({ fecha: fechaActual }, function(err, count) {
        if (err) {
            console.error('Error al buscar las visitas diarias', err);
            return res.status(500).json({ error: 'Error al buscar las visitas diarias' });
        }
        return res.json({ visitasDiarias: count });
    });
});


app.get('/visitasSemanales', function(req, res) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Obtener la fecha de hace una semana
    var fechaSemanaPasada = new Date();
    fechaSemanaPasada.setDate(fechaSemanaPasada.getDate() - 7);
    fechaSemanaPasada.setHours(0, 0, 0, 0);

    // Buscar todas las visitas en el rango de fechas
    Visita.countDocuments({ fecha: { $gte: fechaSemanaPasada, $lte: fechaActual } }, function(err, count) {
        if (err) {
            console.error('Error al buscar las visitas semanales', err);
            return res.status(500).json({ error: 'Error al buscar las visitas semanales' });
        }
        return res.json({ visitasSemanales: count });
    });
});


app.get('/visitasMensuales', function(req, res) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Obtener la fecha de hace un mes
    var fechaMesPasado = new Date();
    fechaMesPasado.setMonth(fechaMesPasado.getMonth() - 1);
    fechaMesPasado.setHours(0, 0, 0, 0);

    // Buscar todas las visitas en el rango de fechas
    Visita.countDocuments({ fecha: { $gte: fechaMesPasado, $lte: fechaActual } }, function(err, count) {
        if (err) {
            console.error('Error al buscar las visitas mensuales', err);
            return res.status(500).json({ error: 'Error al buscar las visitas mensuales' });
        }
        return res.json({ visitasMensuales: count });
    });
});


app.get('/visitasAnuales', function(req, res) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Obtener la fecha de hace un año
    var fechaAnioPasado = new Date();
    fechaAnioPasado.setFullYear(fechaAnioPasado.getFullYear() - 1);
    fechaAnioPasado.setHours(0, 0, 0, 0);

    // Buscar todas las visitas en el rango de fechas
    Visita.countDocuments({ fecha: { $gte: fechaAnioPasado, $lte: fechaActual } }, function(err, count) {
        if (err) {
            console.error('Error al buscar las visitas anuales', err);
            return res.status(500).json({ error: 'Error al buscar las visitas anuales' });
        }
        return res.json({ visitasAnuales: count });
    });
});


module.exports = app;