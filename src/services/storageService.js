const fs = require('fs').promises;
const path = require('path');
const { uploadDir, baseUrl } = require('../config/storage');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/apiError');

class StorageService {
    constructor() {
        this.ensureUploadDirExists();
    }

    async ensureUploadDirExists() {
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
            throw new ApiError('Failed to initialize storage directory', 500);
        }
    }

    /**
     * Upload a file to the specified folder
     * @param {Object} file - Multer object
     * @param {string} folder - Target folder
     * @returns {Promise<string>} Public URL of the upload file
     * @throws {ApiError} If upload fails
     */
    async uploadFile(file, folder) {
        try {
            const fileExtension = path.extname(file.originalname);
            const fileName = `${folder}/${uuidv4()}${fileExtension}`;
            const destinationPath = path.join(uploadDir, fileName);

            // ensure directory exists
            await fs.mkdir(path.dirname(destinationPath), { recursive: true });
            await fs.rename(file.path, destinationPath);

            // return public url
            return `${baseUrl}/${fileName}`;
        } catch (error) {
            //Clean up temp file if upload fails
            if (file?.path) {
                await this.safeDelete(file.path);
            }
            throw error instanceof ApiError ? error : new ApiError('File upload failed', 500);
        }
    }

    /**
     * Deletes a file from storage
     * @param {string} fileUrl - Public URL of the file to delete
     * @returns {Promise<void>}
     */
    async deleteFile(fileUrl) {
        if (!fileUrl) return;

        try {
            const relativePath = fileUrl.replace(baseUrl, '').replace(/^\//, '');
            const filePath = path.join(uploadDir, relativePath);
            await fs.unlink(filePath);
        } catch (error) {
            throw new ApiError('Failed to delete file', 500);
        }
    }

    /**
     * Gets the storage key from a URL
     * @param {string} fileUrl - Public URL of the file
     * @returns {string} Storage key/path
     */
    async getFileKey(fileUrl) {
        if (!fileUrl || !fileUrl.includes(baseUrl)) return null;
        return fileUrl.replace(baseUrl, '').replace(/^\//, '');
    }

    /**
     * Safely deletes a file if it exists
     * @param {string} filePath - Full path to the file
     * @returns {Promise<void>}
     */
    async safeDelete(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error; //Ignore "file not found" error
        }
    }
}

module.exports = StorageService;
