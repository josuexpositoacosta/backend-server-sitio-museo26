'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
    fileName: { type: String },
    fileUrl: { type: String },
    uploadDate: { type: Date, default: Date.now() }
});
module.exports = mongoose.model('Image', Image);