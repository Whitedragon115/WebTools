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

                const filePath = path.join(__dirname, '/api/interface/', 'ViewOnline.html');
                console.log(filePath)

                let html = fs.readFileSync(filePath, 'utf-8');


                res.status(200).json({ message: 'success', image });





            } catch (error) {
                // 處理查詢時的錯誤
                console.error(error);
                res.status(500).json({ message: 'An error occurred while fetching the image.' });
            }


        });



    }
}