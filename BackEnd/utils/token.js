const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

// Generate JWT Access Token (Short-lived)
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id || user.id,
            role: user.role,
            email: user.email,
            tokenVersion: user.tokenVersion || 0
        },
        config.jwtSecret,
        { expiresIn: config.jwtAccessExpiresIn }
    );
};

// Generate Refresh Token payload / secret string
const generateRefreshTokenString = () => {
    return crypto.randomBytes(40).toString('hex');
};

// Hash refresh token for DB storage (prevents token theft if DB read occurs)
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Cookie options helper
const getRefreshTokenCookieOptions = (rememberMe = false) => {
    const isProduction = config.nodeEnv === 'production';
    const days = rememberMe ? 30 : 7;
    const maxAge = days * 24 * 60 * 60 * 1000;

    return {
        httpOnly: true,
        secure: isProduction, // Set to true in HTTPS production environment
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: maxAge
    };
};

// Set Refresh Token Cookie on Response
const setRefreshTokenCookie = (res, refreshToken, rememberMe = false) => {
    const options = getRefreshTokenCookieOptions(rememberMe);
    res.cookie('refreshToken', refreshToken, options);
};

// Clear Refresh Token Cookie on Logout
const clearRefreshTokenCookie = (res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshTokenString,
    hashToken,
    getRefreshTokenCookieOptions,
    setRefreshTokenCookie,
    clearRefreshTokenCookie
};
