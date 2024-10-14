const express = require('express');
const path = require('path');

const publicpath = path.join(__dirname, '../public');
const apiInterface = path.join(__dirname, '../api/interface');

module.exports = {
    async start(app, PORT) {

        app.use(express.static(publicpath, {
            extensions: ['html'],
        }));

        app.get('/:folder', (req, res) => {
            const folderPath = path.join(publicpath, req.params.folder, 'index.html');
            res.sendFile(folderPath, (err) => { if (err) res.redirect('/404'); });
        });

        app.get('/interface/:file', (req, res) => {
            const fileParams = req.params.file;
            const responcePath = path.join(apiInterface, fileParams);

            res.sendFile(responcePath, (err) => { if (err) res.json({ message: "Error while sending file", error: true }); });
        });

        app.get('/404', (req, res) => {
            res.sendFile(path.join(publicpath, '404.html'));
        });
    }
}
