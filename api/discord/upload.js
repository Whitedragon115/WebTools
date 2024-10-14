const express = require('express');
const multer = require('multer');
const { Random_File } = require('../../function/Random');
const { fileSize } = require('../../function/Format.js');
const { nowTime } = require('../../function/Time.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { userInfo: { name: 'UNKNOW' } };
        cb(null, `Storage/${json.userInfo.name}`);
    },
    filename: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { userInfo: { name: 'UNKNOW' } };

        const formateName = file.originalname.split('.').slice(0, -1).join('').replace(/_|\s/g, '-');
        const shortName = formateName.length > 5 ? formateName.slice(0, 5) + "..." : formateName;

        const Filename = `${json.userInfo.name}_${shortName}_${Random_File(3, 4)}.${file.originalname.split('.').pop()}`;
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

        app.post('/api/discord/v1/upload', upload.any(), async (req, res, next) => {

            if (!req.headers['authorization']) return res.status(401).json({ message: 'No authorization header', error: true });
            if (req.headers['authorization'] !== 'Bearer test') return res.status(401).json({ message: 'Invalid token', error: true });
            if (!req.headers['content-type'].includes('multipart/form-data')) return res.status(400).json({ message: 'wrong content type', error: true });

            const jsonData = JSON.parse(req.headers.json)

            const fileInfo = req.files.map(file => {

                const fileId = file.filename.split('_')[2].split('.')[0]

                const resData = {
                    fileId: fileId,
                    time: nowTime(),
                    fileName: file.filename,
                    type: file.mimetype.split('/').pop(),
                    size: file.size,
                    formatSize: fileSize(file.size),
                    link: {
                        viewLink: process.env.webdomain + '/image/' + fileId,
                        downloadLink: process.env.webdomain + '/file/' + fileId + '/download'
                    },
                    other: {
                        originalName: file.originalname,
                        fullTypeName: file.mimetype,
                        encoding: file.encoding,
                    }
                }

                return resData;
            });

            for (let i = 0; i < fileInfo.length; i++) {
                const resData = fileInfo[i];

                await client.prisma.FileData.create({
                    data: {
                        id: resData.fileId,
                        MsgId: jsonData.MsgId[i],
                        Size: resData.formatSize,
                        Name: resData.fileName,
                        Type: resData.type,
                        UploaderId: jsonData.userInfo.userId,
                        Link: resData.link.viewLink,
                        DownloadLink: resData.link.downloadLink,
                        CreatedAt: resData.time
                    }
                });

            }

            res.json({ message: 'Upload success', error: false, info: fileInfo });

        });

    }
}

