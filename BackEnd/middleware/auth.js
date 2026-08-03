const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies short-lived JWT Access Token & token versioning
 */
const isAuthenticated = async (req, res, next) => {
    try {
        let token;
        
        // Extract token from Bearer header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                code: 'NO_TOKEN',
                message: 'Access denied. Authentication token required.'
            });
        }

        // Verify JWT signature and expiration
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (jwtErr) {
            if (jwtErr.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    code: 'TOKEN_EXPIRED',
                    message: 'Access token expired. Please refresh your token.'
                });
            }
            return res.status(401).json({
                success: false,
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token.'
            });
        }

        // Find user by decoded ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                code: 'USER_NOT_FOUND',
                message: 'User belonging to this token no longer exists.'
            });
        }

        // Token version revocation check (Logout from All Devices)
        if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({
                success: false,
                code: 'TOKEN_REVOKED',
                message: 'Session has been invalidated. Please log in again.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication check failed.',
            error: error.message
        });
    }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param {...String} roles Allowed user roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        // Admin override or match role
        const userRole = req.user.role;
        
        // Map alias roles
        const normalizedUserRole = userRole === 'college_admin' ? 'admin' : userRole;
        const normalizedAllowedRoles = roles.map(r => r === 'college_admin' ? 'admin' : r);

        if (!normalizedAllowedRoles.includes(normalizedUserRole) && normalizedUserRole !== 'admin') {
            return res.status(403).json({
                success: false,
                code: 'FORBIDDEN',
                message: `Access denied: Role '${req.user.role}' is not authorized to access this resource.`
            });
        }

        next();
    };
};

// Convenient exports
const isAdmin = authorize('admin');
const isFacultyOrAdmin = authorize('admin', 'faculty');

module.exports = {
    isAuthenticated,
    authorize,
    isAdmin,
    isFacultyOrAdmin
};