const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const path = require('path');
const chalk = require('chalk');

const express = require('express');
const app = express();

let prisma = new PrismaClient();
const client = { prisma: prisma, log: log };

const PORT = process.env.webport;
const api = require('./api/api-index.js');
const web = require('./web/init.js');

//Start server main function
initialize().catch(error => {
    log('error', `啟動應用時發生未捕獲的錯誤: ${error.message}`);
});

process.on('SIGINT', async () => {
    log('info', '正在關閉服務器...');
    if (client.prisma) {
        await client.prisma.$disconnect().catch(() => { });
        log('success', '數據庫連接已安全關閉.');
    }
    log('success', '再見! 👋');
    process.exit();
});



async function startServer() {
    log('info', '正在初始化 Web 服務...');
    web.start(app, client);

    log('info', '正在初始化 API 服務...');
    api.init(app, client);
    
    app.listen(PORT, () => {
        log('success', `服務器成功啟動並監聽於端口 ${PORT} 🚀`);
        log('info', `訪問地址: http://localhost:${PORT}`);
    });
}

async function initialize() {
    try {
        
        if (process.env.bypassDatabaseCheck === 'true') {
            log('warning', '已跳過數據庫檢查! 這可能導致潛在的數據不一致問題.');
            return await startServer();
        }

        log('info', '準備初始化 Prisma...');
        
        try {
            log('database', '正在生成 Prisma Client...');
            execSync('npx prisma generate', { stdio: ['ignore', 'pipe', 'pipe'] });
            log('success', 'Prisma Client 生成完成');
        } catch (error) {
            log('warning', `無法生成 Prisma Client: ${error.message}`);
        }
        
        try {
            if (!prisma) {
                const { PrismaClient } = await import('@prisma/client');
                prisma = new PrismaClient();
                client.prisma = prisma;
            }

            await prisma.$connect();
            log('success', '數據庫連接成功！');

            
            try {
                execSync('npx prisma db push --accept-data-loss', { stdio: ['ignore', 'pipe', 'pipe'] });
                log('success', '數據庫結構同步完成');
            } catch (error) {
                log('warning', `數據庫同步過程發生錯誤: ${error.message}`);
            }
        } catch (error) {
            log('error', `無法初始化 Prisma Client: ${error.message}`);
        }
    } catch (error) {
        log('error', `初始化過程發生錯誤: ${error.message}`);
    }

    await startServer();
}

function log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    switch (type) {
        case 'info':
            console.log(`${chalk.bold.cyan(`[${timestamp}] [INFO]`)} ${message}`);
            break;
        case 'success':
            console.log(`${chalk.bold.green(`[${timestamp}] [SUCCESS]`)} ${message}`);
            break;
        case 'warning':
            console.log(`${chalk.bold.yellow(`[${timestamp}] [WARNING]`)} ${message}`);
            break;
        case 'error':
            console.log(`${chalk.bold.red(`[${timestamp}] [ERROR]`)} ${message}`);
            break;
        case 'database':
            console.log(`${chalk.bold.magenta(`[${timestamp}] [DATABASE]`)} ${message}`);
            break;
        default:
            console.log(`${chalk.bold.white(`[${timestamp}] [LOG]`)} ${message}`);
    }
}

module.exports = {
    client,
    app
};
