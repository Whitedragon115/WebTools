const express = require('express');
const multer = require('multer');
const { Random_File } = require('../../function/Random');
const { fileSize } = require('../../function/Format.js');
const { nowTime } = require('../../function/Time.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { userId: 'UNKNOW' };
        cb(null, `Storage/${json.userId}`);
    },
    filename: (req, file, cb) => {
        const json = JSON.parse(req.headers.json) ?? { userId: 'UNKNOW' };

        const formateName = file.originalname.split('.').slice(0, -1).join('').replace(/_|\s/g, '-');
        const shortName = formateName.length > 5 ? formateName.slice(0, 5) + "..." : formateName;

        const Filename = `${json.userId}_${shortName}_${Random_File(3, 4)}.${file.originalname.split('.').pop()}`;
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

        app.post('/api/discord/v1/upload', async (req, res, next) => {

            if (!req.headers['authorization']) return res.status(401).json({ message: 'No authorization header', error: true });
            const findToken = await client.prisma.User.findUnique({ where: { UserToken: req.headers['authorization'].split(' ')[1] } });
            if (!findToken) return res.status(401).json({ message: 'Invalid token', error: true });
            if (!req.headers['content-type'].includes('multipart/form-data')) return res.status(400).json({ message: 'wrong content type', error: true });

            next();
        }, upload.any(), async (req, res) => {

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
                        viewLink: "http://localhost:4002" + '/cdn/' + fileId,
                        rawLink: "http://localhost:4002" + '/file/' + fileId,
                        downloadLink: "http://localhost:4002" + '/file/' + fileId + '/download'
                        // viewLink: process.env.webdomain + '/image/' + fileId,
                        // rawLink: process.env.webdomain + '/file/' + fileId,
                        // downloadLink: process.env.webdomain + '/file/' + fileId + '/download'
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
                        FileId: resData.fileId,
                        FileName: resData.other.originalName,
                        FileType: resData.type,
                        FileSize: resData.formatSize,
                        FileLink: {
                            PageLink: resData.link.viewLink,
                            RawLink: resData.link.rawLink,
                            downloadLink: resData.link.downloadLink,
                        },
                        UploaderName: jsonData.userName,
                        UploaderID: jsonData.userId,
                        CreateAt: resData.time,
                        Other: {
                            FullTypeName: resData.other.fullTypeName,
                            LongFileName: resData.fileName,
                            Encoding: resData.other.encoding,
                        },
                    }
                });

            }

            res.json({ message: 'Upload success', error: false, info: fileInfo });

        });
    }
}

