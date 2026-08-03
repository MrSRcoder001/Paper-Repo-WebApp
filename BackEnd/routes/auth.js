const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { isAuthenticated } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');
const {
    validate,
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    googleAuthSchema
} = require('../middleware/validate');
const {
    generateAccessToken,
    generateRefreshTokenString,
    hashToken,
    setRefreshTokenCookie,
    clearRefreshTokenCookie
} = require('../utils/token');

// Helper to parse basic device info from user agent
const getDeviceInfo = (req) => {
    const ua = req.headers['user-agent'] || '';
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Macintosh')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return {
        ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        userAgent: ua.substring(0, 150),
        browser,
        os,
        deviceType: /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop'
    };
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account with validation & initial tokens
 */
router.post('/register', authRateLimiter, validate(registerSchema), async (req, res, next) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Check if user already exists
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email address already exists.'
            });
        }

        // Auto-generate username from email if omitted
        const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let finalUsername = username ? username.toLowerCase() : `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;

        let existingUsername = await User.findOne({ username: finalUsername });
        if (existingUsername) {
            if (username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is already taken. Please choose another.'
                });
            } else {
                finalUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
            }
        }

        // If first registered user, optionally make admin, else requested role
        const userCount = await User.countDocuments();
        const assignedRole = userCount === 0 ? 'admin' : (role || 'student');

        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = new User({
            name,
            username: finalUsername,
            email: email.toLowerCase(),
            password,
            role: assignedRole,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false
        });

        await user.save();

        // Create JWT tokens
        const accessToken = generateAccessToken(user);
        const rawRefreshToken = generateRefreshTokenString();
        const tokenHash = hashToken(rawRefreshToken);

        const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Create session in DB
        await RefreshToken.create({
            user: user._id,
            tokenHash,
            deviceInfo: getDeviceInfo(req),
            rememberMe: false,
            expiresAt: refreshExpiresAt
        });

        // Set HTTP-only Cookie
        setRefreshTokenCookie(res, rawRefreshToken, false);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Verification code has been issued.',
            accessToken,
            verificationCode, // Returned for UI testing / verification simulation
            user: user.toAuthJSON()
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, handle brute force checks, and issue Access + Refresh tokens
 */
router.post('/login', authRateLimiter, validate(loginSchema), async (req, res, next) => {
    try {
        const { username, password, rememberMe } = req.body;
        const normalizedInput = username.toLowerCase().trim();

        // Find user by username or email
        const user = await User.findOne({
            $or: [{ username: normalizedInput }, { email: normalizedInput }]
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email/username or password.'
            });
        }

        // Check if account is locked due to too many failed attempts
        if (user.isLocked) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            return res.status(429).json({
                success: false,
                message: `Account is temporarily locked due to multiple failed login attempts. Try again in ${minutesLeft} minute(s).`
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.incFailedLogin();
            return res.status(401).json({
                success: false,
                message: 'Invalid email/username or password.'
            });
        }

        // Reset failed attempts on success
        await user.resetLoginAttempts();

        // Generate Access Token & Refresh Token
        const accessToken = generateAccessToken(user);
        const rawRefreshToken = generateRefreshTokenString();
        const tokenHash = hashToken(rawRefreshToken);

        const days = rememberMe ? 30 : 7;
        const refreshExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Store session in database
        await RefreshToken.create({
            user: user._id,
            tokenHash,
            deviceInfo: getDeviceInfo(req),
            rememberMe,
            expiresAt: refreshExpiresAt
        });

        // Set secure HTTP-only Cookie
        setRefreshTokenCookie(res, rawRefreshToken, rememberMe);

        res.json({
            success: true,
            message: 'Login successful!',
            accessToken,
            user: user.toAuthJSON()
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login/register endpoint
 */
router.post('/google', authRateLimiter, validate(googleAuthSchema), async (req, res, next) => {
    try {
        const { googleId, email, name, avatar } = req.body;
        
        const effectiveEmail = email || `user_${Date.now()}@google.com`;
        const effectiveGoogleId = googleId || `google_${Date.now()}`;
        const effectiveName = name || 'Google User';

        let user = await User.findOne({
            $or: [{ googleId: effectiveGoogleId }, { email: effectiveEmail.toLowerCase() }]
        });

        if (!user) {
            // Auto register google user
            const baseUsername = effectiveEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
            const username = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;

            user = new User({
                name: effectiveName,
                username: username.toLowerCase(),
                email: effectiveEmail.toLowerCase(),
                googleId: effectiveGoogleId,
                avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                role: 'student',
                isEmailVerified: true
            });
            await user.save();
        } else {
            if (!user.googleId) {
                user.googleId = effectiveGoogleId;
            }
            user.isEmailVerified = true;
            await user.save();
        }

        const accessToken = generateAccessToken(user);
        const rawRefreshToken = generateRefreshTokenString();
        const tokenHash = hashToken(rawRefreshToken);

        const refreshExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        await RefreshToken.create({
            user: user._id,
            tokenHash,
            deviceInfo: getDeviceInfo(req),
            rememberMe: true,
            expiresAt: refreshExpiresAt
        });

        setRefreshTokenCookie(res, rawRefreshToken, true);

        res.json({
            success: true,
            message: 'Google login successful!',
            accessToken,
            user: user.toAuthJSON()
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh Access Token and Rotate Refresh Token (with reuse detection)
 */
router.post('/refresh-token', async (req, res, next) => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!rawRefreshToken) {
            return res.status(401).json({
                success: false,
                code: 'NO_REFRESH_TOKEN',
                message: 'Refresh token cookie or payload missing.'
            });
        }

        const incomingTokenHash = hashToken(rawRefreshToken);
        const existingSession = await RefreshToken.findOne({ tokenHash: incomingTokenHash });

        // Token Reuse Detection: If token is not active, check if it was replaced!
        if (!existingSession) {
            const reusedSession = await RefreshToken.findOne({ replacedByTokenHash: incomingTokenHash });
            if (reusedSession) {
                // SECURITY BREACH WARNING: Token Reuse Detected!
                // Revoke ALL refresh tokens for this user immediately!
                await RefreshToken.updateMany({ user: reusedSession.user }, { isRevoked: true });
                clearRefreshTokenCookie(res);
                return res.status(403).json({
                    success: false,
                    code: 'TOKEN_REUSE_DETECTED',
                    message: 'Security warning: Refresh token reuse detected. All active sessions have been revoked.'
                });
            }

            clearRefreshTokenCookie(res);
            return res.status(401).json({
                success: false,
                code: 'INVALID_REFRESH_TOKEN',
                message: 'Invalid or expired session. Please login again.'
            });
        }

        // Check if token is revoked or expired
        if (existingSession.isRevoked || existingSession.expiresAt < new Date()) {
            clearRefreshTokenCookie(res);
            return res.status(401).json({
                success: false,
                code: 'EXPIRED_REFRESH_TOKEN',
                message: 'Session has expired. Please login again.'
            });
        }

        // Find associated user
        const user = await User.findById(existingSession.user);
        if (!user) {
            clearRefreshTokenCookie(res);
            return res.status(401).json({
                success: false,
                code: 'USER_NOT_FOUND',
                message: 'User associated with session not found.'
            });
        }

        // TOKEN ROTATION: Issue new Access Token & new Refresh Token
        const newAccessToken = generateAccessToken(user);
        const newRawRefreshToken = generateRefreshTokenString();
        const newTokenHash = hashToken(newRawRefreshToken);

        const rememberMe = existingSession.rememberMe;
        const days = rememberMe ? 30 : 7;
        const newExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        // Mark old token as revoked and replaced by new token
        existingSession.isRevoked = true;
        existingSession.replacedByTokenHash = newTokenHash;
        await existingSession.save();

        // Save new session
        await RefreshToken.create({
            user: user._id,
            tokenHash: newTokenHash,
            deviceInfo: getDeviceInfo(req),
            rememberMe,
            expiresAt: newExpiresAt
        });

        // Set new HTTP-only cookie
        setRefreshTokenCookie(res, newRawRefreshToken, rememberMe);

        res.json({
            success: true,
            accessToken: newAccessToken,
            user: user.toAuthJSON()
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address using 6-digit code
 */
router.post('/verify-email', validate(verifyEmailSchema), async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email not found.'
            });
        }

        if (user.isEmailVerified) {
            return res.json({
                success: true,
                message: 'Email address is already verified.',
                user: user.toAuthJSON()
            });
        }

        if (user.emailVerificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code.'
            });
        }

        if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new code.'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;
        await user.save();

        res.json({
            success: true,
            message: 'Email address verified successfully!',
            user: user.toAuthJSON()
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification code
 */
router.post('/resend-verification', validate(resendVerificationSchema), async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email not found.'
            });
        }

        if (user.isEmailVerified) {
            return res.json({
                success: true,
                message: 'Email address is already verified.'
            });
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationCode = newCode;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        res.json({
            success: true,
            message: 'New verification code generated.',
            verificationCode: newCode
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user from current device (revoke refresh token & clear cookie)
 */
router.post('/logout', async (req, res, next) => {
    try {
        const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (rawRefreshToken) {
            const tokenHash = hashToken(rawRefreshToken);
            await RefreshToken.updateOne({ tokenHash }, { isRevoked: true });
        }

        clearRefreshTokenCookie(res);

        res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout user from ALL devices (revoke all sessions & increment tokenVersion)
 */
router.post('/logout-all', isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Revoke all refresh token sessions in DB
        await RefreshToken.updateMany({ user: userId }, { isRevoked: true });

        // Increment tokenVersion in user document to invalidate active access tokens
        req.user.tokenVersion += 1;
        await req.user.save();

        clearRefreshTokenCookie(res);

        res.json({
            success: true,
            message: 'Successfully logged out from all devices.'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 */
router.get('/me', isAuthenticated, async (req, res) => {
    res.json({
        success: true,
        user: req.user.toAuthJSON()
    });
});

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions for current user
 */
router.get('/sessions', isAuthenticated, async (req, res, next) => {
    try {
        const currentToken = req.cookies?.refreshToken;
        const currentTokenHash = currentToken ? hashToken(currentToken) : null;

        const sessions = await RefreshToken.find({
            user: req.user._id,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        }).sort({ lastActive: -1 });

        const formattedSessions = sessions.map(session => ({
            id: session._id,
            deviceInfo: session.deviceInfo,
            lastActive: session.lastActive,
            createdAt: session.createdAt,
            isCurrent: session.tokenHash === currentTokenHash
        }));

        res.json({
            success: true,
            sessions: formattedSessions
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke a specific session by session ID
 */
router.delete('/sessions/:sessionId', isAuthenticated, async (req, res, next) => {
    try {
        const session = await RefreshToken.findOne({
            _id: req.params.sessionId,
            user: req.user._id
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found or already revoked.'
            });
        }

        session.isRevoked = true;
        await session.save();

        res.json({
            success: true,
            message: 'Session revoked successfully.'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;