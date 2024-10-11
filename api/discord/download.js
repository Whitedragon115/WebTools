const express = require('express');
const path = require('path');

module.exports = {
    name: 'download',
    async execute(app) {

        app.get('api/discord/v1/download/:filename', (req, res) => {
            const filename = req.params.filename;
            const filePath = path.join(__dirname, 'uploads', filename);

            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                res.status(404).send('檔案未找到');
            }
        });


    }
}
