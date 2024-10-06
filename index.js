const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;

// Serve static files from the 'public' directory, and map index.html to the folder path
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
}));

app.get('/:folder', (req, res) => {
    const folderPath = path.join(__dirname, 'public', req.params.folder, 'index.html');
    res.sendFile(folderPath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://tool.whitedragon.life`);
});