const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { uploadDir } = require('../config/storage');
const ApiResponse = require('../utils/responseHandler');

// ensure upload directory exists
const ensureUploadDir = async () => {
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory: ', error);
    }
};
ensureUploadDir();

// file filter image
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and WEBP are allowed.'));
    }
};

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqeSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqeSuffix}${path.extname(file.originalname)}`);
    },
});

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB limit
    },
});

// Middleware to handle file uploads
const handleFileUpload = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return ApiResponse.error(res, `File upload error: ${err.message}`, 400);
            } else if (err) {
                return ApiResponse.error(res, err.message, 400);
            }
            if (!req.file && req.method === 'POST') {
                return ApiResponse.error(res, `${fieldName} is required`, 400);
            }
            next();
        });
    };
};

module.exports = {
    handleFileUpload,
};
