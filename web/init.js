const express = require('express');
const path = require('path');

const publicpath = path.join(__dirname, '../public');

module.exports = {
    async start(app, PORT) {

        app.use(express.static(publicpath, {
            extensions: ['html'],
        }));

        app.get('/:folder', (req, res) => {
            const folderPath = path.join(publicpath, req.params.folder, 'index.html');
            res.sendFile(folderPath, (err) => { if (err) res.redirect('/404'); });
        });

        app.get('/404', (req, res) => {
            res.sendFile(path.join(publicpath, '404.html'));
        });
    }
}
