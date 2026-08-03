require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'papervault-super-secret-access-token-key-2026',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'papervault-super-secret-refresh-token-key-2026',
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    jwtRefreshExpiresInRemember: process.env.JWT_REFRESH_EXPIRES_IN_REMEMBER || '30d',
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
    allowedFileTypes: ['.pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    database: {
        url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/vpkbiet-papers'
    }
};
 