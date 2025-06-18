const fs = require('fs').promises;
const path = require('path');
const { uploadDir, baseUrl } = require('../config/storage');
const { v4: uuidv4 } = require('uuid');

class StorageService {
    static async uploadFile(file, folder) {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${folder}/${uuidv4()}${fileExtension}`;
        const destinationPath = path.join(uploadDir, fileName);

        // ensure directory exists
        await fs.mkdir(path.dirname(destinationPath), { recursive: true });
        await fs.rename(file.path, destinationPath);

        // return public url
        return `${baseUrl}/${fileName}`;
    }

    static async deleteFile(fileUrl) {
        if (!fileUrl) return;

        const relativePath = fileUrl.replace(baseUrl, '').replace(/^\//, '');
        const filePath = path.join(uploadDir, relativePath);

        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error; //ignore if file does not exists
        }
    }
}

module.exports = StorageService;
