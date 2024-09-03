var express = require("express");
var app = express();

const path = require('path');
const fs = require("fs");

const bodyParser = require("body-parser");

const multer = require("multer");
//const mongoose = require("mongoose");
var imageModel = require('../models/imagenes');


//app.use(bodyParser.urlencoded({ extended: true }))

//app.set("view engine", "ejs");

// SET STORAGE
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

/*
app.get("/", (req, res) => {
    res.render("index");
})
*/

app.post("/uploadphoto", upload.single('myImage'), (req, res) => {
        var img = fs.readFileSync(req.file.path);
        var encode_img = img.toString('base64');
        var final_img = {
            contentType: req.file.mimetype,
            image: new Buffer(encode_img, 'base64')
        };
        imageModel.create(final_img, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result.img.Buffer);
                console.log("Saved To database");
                res.contentType(final_img.contentType);
                res.send(final_img.image);
            }
        })
    })
    //Code to start server
    /*app.listen(3000, function() {
        console.log("Server Started at PORT 2000");
    })*/

module.exports = app;