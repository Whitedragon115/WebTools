const express = require('express');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'Storage'); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
})

const upload = multer({ storage });

module.exports = {
    name: 'upload',
    async execute(app) {

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.post('/api/discord/v1/upload', (req, res, next) => {
            if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
                return res.status(400).json({ message: 'No file uploaded', error: true });
            }
            next();
        }, upload.any(), (req, res) => {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No file uploaded', error: true });
            }
            res.json({ message: 'Upload success', error: false, files: req.files.map(file => file.originalname) });
        });


    }
}