require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
    allowedFileTypes: ['.pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/papers-db'
    }
}; 