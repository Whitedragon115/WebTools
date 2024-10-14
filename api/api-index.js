const fs = require('fs');
const path = require('path');

const apiFolderPath = path.join(__dirname, '../api');
const readfiles = fs.readdirSync(apiFolderPath);

module.exports = {
    async init(app, client) {

        for (const folder of readfiles) {
            const subFolderPath = path.join(apiFolderPath, folder);
            if (!fs.lstatSync(subFolderPath).isDirectory() || folder == "interface") continue;
            const apiFile = fs.readdirSync(subFolderPath).filter(file => file.endsWith('.js'));
            for (const file of apiFile) {
                const filePath = path.join(subFolderPath, file);
                const api = require(filePath);
                if ('name' in api && 'execute' in api) {
                    api.execute(app, client);
                } else {
                    console.log(`[warning] The api at ${filePath} is missing a required "name" or "execute" property.`);
                }
            }
        }

    }
}
