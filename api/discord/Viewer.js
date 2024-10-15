const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'viewer',

    /**
     * @param {express.Application} app
     */

    async execute(app, client) {

        app.get('/file/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const image = await client.prisma.FileData.findUnique({ where: { FileId: id } });
                if (!image) return res.redirect('/404');
                const imageowner = await client.prisma.User.findUnique({ where: { DiscordId: image.UploaderID } });
                
                const userDataJson = fs.readFileSync(path.join(__dirname, '../../storage/', image.UploaderID, 'user.json'), 'utf-8');
                const userData = JSON.parse(userDataJson);

                const filePath = path.join(__dirname, '../interface/', 'ViewOnline.html');
                let html = fs.readFileSync(filePath, 'utf-8');
                html = html
                    .replace("{FILELINK}", image.FileLink.RawLink)
                    .replace("{FILENAME}", image.FileName)
                    .replace("{FILETYPE}", image.FileType)
                    .replace("{FILESIZE}", image.FileSize)
                    .replace("{UPLOADTIME}", image.CreateAt)
                    .replace("{UPLOADER}", image.UploaderName)
                    .replace("{FILEID}", image.FileId)
                    .replace("{AVATAR}", imageowner.DiscordAvatar)
                    .replace("{VIEW}", userData.FileView.find(arr => arr.FileId === id).ViewCount + 1)

                if (image.Other.FullTypeName.startsWith("image")) {
                    html = html.replace("{FILELINK}", image.FileLink.RawLink)
                } else {
                    html = html.replace("{FILELINK}", "https://placehold.co/600x400?text=This+is+not+a+image+file")
                }

                userData.ViewCount += 1;
                userData.FileView.find(arr => arr.FileId === id).ViewCount += 1;

                res.status(200).send(html);

                fs.writeFileSync(path.join(__dirname, '../../storage/', image.UploaderID, 'user.json'), JSON.stringify(userData, null, 2));

            } catch (error) {
                // 處理查詢時的錯誤
                console.error(error);
                res.status(500).json({ message: 'An error occurred while fetching the image.' });
            }


        });



    }
}