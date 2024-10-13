const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const prisma = new PrismaClient();

const client = {}

const PORT = process.env.webport;
const api = require('./api/api-index.js');
const web = require('./web/init.js');

client.prisma = prisma;

//=========== Prisma Check and Sync Database ===========//
async function checkAndSyncDatabase() {
    try {
        // 1. 連接到數據庫
        await client.prisma.$connect();

        console.log('[CONSOLE] : Checking database structure...');
        // 2. 使用 `prisma db push` 同步 Prisma 模式和 MySQL 數據庫
        exec('npx prisma db push', (error, stdout, stderr) => {
            if (error) {
                console.error(`[ERROR] : Prisma db push failed: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`[ERROR] : ${stderr}`);
                return;
            }
            console.log(`[CONSOLE] : Prisma database sync result:\n${stdout}`);

            // 3. 啟動服務器
            startServer();
        });
    } catch (error) {
        console.error(`[ERROR] : Failed to connect to database: ${error.message}`);
        process.exit(1);
    }
}

function startServer() {
    web.start(app, client);
    api.init(app, client);

    app.listen(PORT, () => {
        console.log(`[CONSOLE] : Server started successfully on port ${PORT}`);
    });
}

// 程序啟動時進行數據庫檢查和同步
checkAndSyncDatabase();

process.on('SIGINT', async () => {
    await client.prisma.$disconnect();
    process.exit();
});

module.exports = {
    client,
    app
}
