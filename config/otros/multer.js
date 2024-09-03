/*jshint esversion: 6 */
// 'use strict'

var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, './uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.filename} - ${Date.now()}.${file.mimetype.split('/')[1]}`);
    }
});

module.exports = storage;