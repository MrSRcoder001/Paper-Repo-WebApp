const rateLimit = require('express-rate-limit');

// Strict Rate Limiting for Auth Endpoints (Login, Register, Password Reset)
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // limit each IP to 15 auth requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
    }
});

// General API Rate Limiting
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

module.exports = {
    authRateLimiter,
    apiRateLimiter
};
