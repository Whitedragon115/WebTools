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

        app.post('/api/discord/v1/upload', upload.single('file'), (req, res) => {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded', error: true });
            res.json({ message: 'Upload success', error: false });
        });

    }
}
