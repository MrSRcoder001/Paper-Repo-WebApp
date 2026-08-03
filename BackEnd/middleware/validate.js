const { z } = require('zod');

// Schema definitions
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username cannot exceed 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores').optional(),
    email: z.string().email('Invalid email address format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['student', 'faculty', 'admin', 'college_admin', 'user']).optional().default('student')
});

const loginSchema = z.object({
    username: z.string().min(1, 'Username or Email is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false)
});

const verifyEmailSchema = z.object({
    email: z.string().email('Invalid email address format'),
    code: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits')
});

const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email address format')
});

const googleAuthSchema = z.object({
    credential: z.string().optional(),
    googleId: z.string().optional(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    avatar: z.string().optional()
});

// Middleware generator
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError || error.name === 'ZodError') {
            const issues = error.issues || error.errors || [];
            const formattedErrors = issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                message: formattedErrors[0]?.message || 'Input validation failed',
                errors: formattedErrors
            });
        }
        next(error);
    }
};

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    googleAuthSchema
};
