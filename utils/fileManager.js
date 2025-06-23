const fs = require('fs').promises;
const path = require('path');

async function readJSON(filePath) {
    const data = await fs.readFile(path.resolve(filePath), 'utf8');
    return JSON.parse(data);
}

async function writeJSON(filePath, data) {
    await fs.writeFile(path.resolve(filePath), JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
