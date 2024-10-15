const express = require('express');
const path = require('path');
const fs = require('fs');
const { Token } = require('../../function/Token.js')

module.exports = {
    name: 'newUser',
    /**
     * @param {express.Application} app
     */
    async execute(app, client) {

        app.use(express.json());

        app.post('/api/discord/v1/createUser', async (req, res) => {

            const VerifyToken = process.env.API_TOKEN;

            if (!req.headers['authorization']) return res.status(401).json({ message: 'No authorization header', error: true });
            if (req.headers['authorization'] !== `Bearer ${VerifyToken}`) return res.status(401).json({ message: 'Invalid token', error: true });
            if (!req.body) return res.status(400).json({ message: 'No body', error: true });

            const NewUserData = req.body;

            if (!NewUserData.discordId) return res.status(400).json({ message: 'No DiscordId', error: true, youData: NewUserData });
            if (!NewUserData.discordName) return res.status(400).json({ message: 'No DiscordName', error: true, youData: NewUserData });
            if (!NewUserData.avatarLink) return res.status(400).json({ message: 'No AvatarLink', error: true, youData: NewUserData });

            const checkingData = await client.prisma.User.findUnique({ where: { DiscordId: req.body.discordId } });
            const Storage = path.join(__dirname, '../../storage/', NewUserData.discordId);

            if (checkingData) return res.status(400).json({ message: 'User already exists', error: true });
            if (fs.existsSync(Storage)) return res.status(400).json({ message: 'User already has storage database', error: true });

            fs.mkdirSync(Storage, { recursive: true });

            const jsonData = {
                "DownloadCount": 0,
                "viewCount": 0,
                "UploadCount": 0,
                "StorageUsed": 0,
                "FileView": []
            }

            fs.writeFileSync(path.join(Storage, 'user.json'), JSON.stringify(jsonData, null, 2));

            const NewUserToken = Token();

            await client.prisma.User.create({
                data: {
                    DiscordId: NewUserData.discordId,
                    DiscordName: NewUserData.discordName,
                    DiscordAvatar: NewUserData.avatarLink,
                    UserToken: NewUserToken,
                }
            });

            const resData = {
                "message": "success",
                "user": {
                    "discordId": NewUserData.discordId,
                    "discordName": NewUserData.discordName,
                    "discordAvatar": NewUserData.avatarLink,
                    "userToken": NewUserToken,
                },
                error: false
            }

            res.json(resData);
        });
    }
}