const fs = require('fs').promises;

const writeToFile = async (destination, content) => {
    try {
        await fs.writeFile(destination, JSON.stringify(content, null, 4));
        console.info(`\nData written to ${destination}`);
    } catch (err) {
        console.error(err);
    }
};

const readAndAppend = async (content, file) => {
    try {
        const data = await fs.readFile(file, 'utf8');
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        await writeToFile(file, parsedData);
    } catch (err) {
        console.error(err);
    }
};

const readFromFile = async (file) => {
    try {
        const data = await fs.readFile(file, 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = { writeToFile, readAndAppend, readFromFile };
