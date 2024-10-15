const path = require('path');
const express = require('express');

module.exports = {
    name: 'DownloadImage',
    /**
     * @param {express.Application} app
     */

    async execute(app, client) {

        app.get('/cdn/:fileId/download', async (req, res) => {

            const fileId = req.params.fileId;
            const fileData = await client.prisma.FileData.findUnique({ where: { FileId: fileId } });
            if (!fileData) return res.status(404).send('https://placehold.co/600x400?text=Image+API+Broke+Again...');
            
            const filePath = path.join(__dirname, '../../storage/', fileData.UploaderID, fileData.Other.LongFileName);
            res.status(200).download(filePath);
        });
        
    }
}