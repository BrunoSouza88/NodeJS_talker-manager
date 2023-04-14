const fs = require('fs').promises;

const writingFile = async (path, newFile) => {
  try {
    const data = await fs.writeFile(path, JSON.stringify(newFile));
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = writingFile;