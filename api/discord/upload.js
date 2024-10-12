const express = require('express');
const multer = require('multer');
const { Random_File } = require('../../function/Random');
const { fileSize } = require('../../function/Format.js');
const { nowTime } = require('../../function/Time.js');
const { time } = require('discord.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { user: 'UNKNOW' };
        cb(null, `Storage/${json.user}`);
    },
    filename: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { user: 'UNKNOW' };

        const formateName = file.originalname.split('.').slice(0, -1).join('').replace(/_|\s/g, '-');
        const shortName = formateName.length > 5 ? formateName.slice(0, 5) + "..." : formateName;

        const Filename = `${json.user}_${shortName}_${Random_File(3, 4)}.${file.originalname.split('.').pop()}`;
        cb(null, Filename);
    }
})

const upload = multer({ storage });

module.exports = {
    name: 'upload',

    /**
     * @param {express.Application} app
     */

    async execute(app, client) {

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.post('/api/discord/v1/upload', upload.any(), (req, res, next) => {

            if (!req.headers['authorization']) return res.status(401).json({ message: 'No authorization header', error: true });
            if (req.headers['authorization'] !== 'Bearer test') return res.status(401).json({ message: 'Invalid token', error: true });
            if (!req.headers['content-type'].includes('multipart/form-data')) return res.status(400).json({ message: 'wrong content type', error: true });


            const fileInfo = req.files.map(file => {

                const fileId = file.filename.split('_')[2].split('.')[0]

                client

                return {
                    fileId: fileId,
                    time: nowTime(),
                    fileName: file.filename,
                    originalName: file.originalname,
                    type: file.mimetype.split('/').pop(),
                    size: file.size,
                    formatSize: fileSize(file.size),
                    link: process.env.webdomain + '/file/' + fileId,
                }
            });

            res.json({ message: 'Upload success', error: false, info: fileInfo, original: req.files });

        });

    }
}


