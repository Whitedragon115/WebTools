const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

const PORT = process.env.webport;

const api = require('./api/api-index.js')
const web = require('./web/init.js')

web.start(app);
api.init(app);

app.listen(PORT, () => {
    console.log(`[CONSOLE] : Server started successfully on port ${PORT}`);
});