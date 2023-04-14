const fs = require('fs').promises;

const readingFile = async (path) => {
  const file = await fs.readFile(path, 'utf-8');
  const fileParsed = JSON.parse(file);
  return fileParsed;
};

module.exports = readingFile;