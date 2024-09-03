'use strict'

const router = require('express').Router();
const Image = require('../models/Image');
const storage = require('../config/otros/multer');
const multer = require('multer');

const uploader = multer({
    storage
}).single('file');

router.post('/upload', uploader, async(req, res) => {
    const { body, file } = req
    if (file && body) {
        const newImage = new Image({
            fileName: body.name,
            fileUrl: `http://localhost:3000/${file.fileName} `
        })
        await newImage.save()
        res.json({
            newImage: newImage
        })
    }
})


router.get('/dowload', async(req, res) => {
    const images = await Image.find();
    res.json(images)
})

module.exports = router