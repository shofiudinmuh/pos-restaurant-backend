const path = require('path');
require('dotenv').config();

module.exports = {
    uploadDir: process.env.UPLOAD_DIR || './public/uploads',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
};
