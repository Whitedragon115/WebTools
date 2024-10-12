const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const client = {}

const PORT = process.env.webport;
const api = require('./api/api-index.js')
const web = require('./web/init.js')

client.prisma = prisma;

web.start(app, client);
api.init(app, client);

app.listen(PORT, () => {
    console.log(`[CONSOLE] : Server started successfully on port ${PORT}`);
});