/*jshint esversion: 6 */
var express = require('express');
var app = express();
var nodemailer = require('nodemailer');

app.post('/enviarCorreo', (req, res) => {
    var { destinatario, asunto, mensaje, usuario, contraseña } = req.body;

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: usuario,
            pass: contraseña
        }
    });

    var mailOptions = {
        from: usuario,
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al enviar el correo' });
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).json({ mensaje: 'Correo enviado correctamente' });
        }
    });
});

module.exports = app;
// app.listen(81, (err) => {
//   if (err) {
//     console.log(`Hay un error: ${err}`);
//   } else {
//     console.log('Express Server puerto 81: online');
//   }
// });