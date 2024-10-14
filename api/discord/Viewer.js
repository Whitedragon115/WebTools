const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'viewer',

    /**
     * @param {express.Application} app
     */

    async execute(app, client) {

        app.get('/image/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const image = await client.prisma.FileData.findUnique({ where: { id: id } });
                if (!image) return res.redirect('/404');


                const test = {
                    "message": "success",
                    "image": {
                        "id": "CCS-HDG-KEZ-IXO",
                        "MsgId": "123456789",
                        "Size": "1.46 MB",
                        "Name": "whitedragon_NI-CI..._CCS-HDG-KEZ-IXO.pptx",
                        "Type": "vnd.openxmlformats-officedocument.presentationml.presentation",
                        "UploaderId": "123456789",
                        "Link": "https://tool.whitedragon.life/file/CCS-HDG-KEZ-IXO",
                        "DownloadLink": "https://tool.whitedragon.life/file/CCS-HDG-KEZ-IXO/download",
                        "CreatedAt": "2024-10-13-15-3"
                    }
                }

                const filePath = path.join(__dirname, '../interface/', 'ViewOnline.html');
                let html = fs.readFileSync(filePath, 'utf-8');

                html = html
                    .replace("{IMAGELINK}", image.Link)
                    .replace("{FILENAME}", image.Name)
                    .replace("{FILETYPE}", image.Type)
                    .replace("{FILESIZE}", image.Size)
                    .replace("{UPLOADTIME}", image.CreatedAt)
                    .replace("{UPLOADER}", image.UploaderName)
                    .replace("{FILEID}", image.id)
                    .replace("{IMAGELINK}", image.link)
                    .replace("{AVATAR}", "avatar placeholder")
                    .replace("{VIEW}", "view placeholder")

                res.status(200).send(html);

            } catch (error) {
                // 處理查詢時的錯誤
                console.error(error);
                res.status(500).json({ message: 'An error occurred while fetching the image.' });
            }


        });



    }
}