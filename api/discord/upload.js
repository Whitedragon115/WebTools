const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Random_File } = require('../../function/Random');
const { fileSize } = require('../../function/Format.js');
const { nowTime } = require('../../function/Time.js');

// 優化：先確保儲存目錄存在的函數
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// 儲存設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId || 'UNKNOW';
        const userDir = `storage/${userId}`;
        ensureDirectoryExists(userDir);
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const userName = req.body.userName || 'UNKNOW';

        const formateName = file.originalname.split('.').slice(0, -1).join('').replace(/_|\s/g, '-');
        const shortName = formateName.length > 5 ? formateName.slice(0, 5) + "..." : formateName;

        const ext = file.originalname.split('.').pop();
        const Filename = `${userName}_${shortName}_${Random_File(3, 4)}.${ext}`;
        cb(null, Filename);
    }
});

const upload = multer({ storage });

// 驗證授權函數
async function validateAuth(req, res, client) {
    if (!req.headers['authorization']) {
        return { isValid: false, error: { status: 401, message: 'No authorization header' } };
    }
    
    const token = req.headers['authorization'].split(' ')[1];
    const findToken = await client.prisma.User.findUnique({ where: { UserToken: token } });
    
    if (!findToken) {
        return { isValid: false, error: { status: 401, message: 'Invalid token' } };
    }
    
    return { isValid: true, user: findToken };
}

// 處理上傳文件及生成回應資料
function processUploadedFiles(files, userId, userName) {
    return files.map(file => {
        const fileId = file.filename.split('_')[2].split('.')[0];
        return {
            fileId: fileId,
            time: nowTime(),
            fileName: file.filename,
            type: file.mimetype.split('/').pop(),
            size: file.size,
            formatSize: fileSize(file.size),
            link: {
                viewLink: process.env.webdomain + '/file/' + fileId,
                rawLink: process.env.webdomain + '/cdn/' + fileId,
                downloadLink: process.env.webdomain + '/cdn/' + fileId + '/download'
            },
            other: {
                originalName: file.originalname,
                fullTypeName: file.mimetype,
                encoding: file.encoding,
            }
        };
    });
}

// 將數據保存到資料庫
async function saveToDatabase(fileInfo, userName, userId, client) {
    const savePromises = fileInfo.map(async (resData) => {
        await client.prisma.FileData.create({
            data: {
                FileId: resData.fileId,
                FileName: resData.other.originalName,
                FileType: resData.type,
                FileSize: resData.formatSize,
                FileLink: {
                    PageLink: resData.link.viewLink,
                    RawLink: resData.link.rawLink,
                    downloadLink: resData.link.downloadLink,
                },
                UploaderName: userName,
                UploaderID: userId,
                CreateAt: resData.time,
                Other: {
                    FullTypeName: resData.other.fullTypeName,
                    LongFileName: resData.fileName,
                    Encoding: resData.other.encoding,
                },
            }
        });
    });
    
    await Promise.all(savePromises);
}

// 更新使用者儲存空間資料
function updateUserStorage(userData, files, fileInfo) {
    // 更新已使用空間
    files.forEach(file => {
        userData.StorageUsed += file.size;
    });
    
    // 更新檔案瀏覽計數器
    fileInfo.forEach(file => {
        userData.FileView.push({ 
            FileId: file.fileId, 
            ViewCount: 0, 
            DownloadConut: 0 
        });
    });
    
    // 更新上傳次數
    userData.UploadCount += fileInfo.length;
    
    return userData;
}

module.exports = {
    name: 'upload',

    async execute(app, client) {
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.post('/api/discord/v1/upload', async (req, res, next) => {
            // 驗證授權
            const authResult = await validateAuth(req, res, client);
            if (!authResult.isValid) {
                return res.status(authResult.error.status)
                    .json({ message: authResult.error.message, error: true });
            }
            
            // 檢查內容類型
            if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
                return res.status(400).json({ message: 'wrong content type', error: true });
            }
            
            next();
        }, upload.any(), async (req, res) => {
            try {
                // 驗證必要欄位和檔案
                if (!req.body.userId || !req.body.userName) {
                    return res.status(400).json({ message: '未提供必要欄位: userId 或 userName', error: true });
                }
                
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ message: '未提供檔案', error: true });
                }
                
                const userId = req.body.userId;
                const userName = req.body.userName;
                const userDataPath = path.join(__dirname, '../../storage/', userId, 'user.json');
                
                // 檢查使用者數據文件是否存在
                if (!fs.existsSync(userDataPath)) {
                    return res.status(404).json({ 
                        message: `找不到使用者數據文件，請先建立帳號`, 
                        error: true 
                    });
                }
                
                // 讀取使用者數據
                const userDataJson = fs.readFileSync(userDataPath, 'utf-8');
                const userData = JSON.parse(userDataJson);
                
                // 處理上傳文件
                const fileInfo = processUploadedFiles(req.files, userId, userName);
                
                // 儲存到資料庫
                await saveToDatabase(fileInfo, userName, userId, client);
                
                // 更新使用者儲存空間資料
                const updatedUserData = updateUserStorage(userData, req.files, fileInfo);
                fs.writeFileSync(userDataPath, JSON.stringify(updatedUserData, null, 2));
                
                // 回應成功
                res.json({ message: 'Upload success', error: false, info: fileInfo });
                
            } catch (error) {
                client.log('error', `檔案上傳處理失敗: ${error.message}`);
                res.status(500).json({ 
                    message: '處理上傳時發生錯誤，請稍後再試',
                    error: true 
                });
            }
        });
    }
}

