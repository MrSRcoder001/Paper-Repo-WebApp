const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenHash: {
        type: String,
        required: true,
        index: true
    },
    deviceInfo: {
        ip: { type: String, default: 'Unknown' },
        userAgent: { type: String, default: 'Unknown' },
        browser: { type: String, default: 'Unknown Browser' },
        os: { type: String, default: 'Unknown OS' },
        deviceType: { type: String, default: 'Desktop' }
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    replacedByTokenHash: {
        type: String,
        default: null
    },
    rememberMe: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Automatic TTL cleanup after expiration
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
