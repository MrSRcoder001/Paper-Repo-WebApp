const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'PaperVault User'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }, // Password optional if logged in via Google
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    role: {
        type: String,
        enum: ['student', 'faculty', 'admin', 'college_admin', 'user'],
        default: 'student'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationCode: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    university: {
        type: String,
        default: 'SPPU'
    },
    college: {
        type: String,
        default: 'Pune Engineering College'
    },
    branch: {
        type: String,
        default: 'Computer Engineering'
    },
    semester: {
        type: Number,
        default: 3
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper'
    }],
    downloads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper'
    }],
    studyStreak: {
        type: Number,
        default: 5
    },
    xpPoints: {
        type: Number,
        default: 1250
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual check for locked account
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Increment failed login attempts with lockout logic (5 max attempts -> 15 min lock)
userSchema.methods.incFailedLogin = async function() {
    // If lock expired, reset
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { failedLoginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    const updates = { $inc: { failedLoginAttempts: 1 } };
    if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) }; // Lock for 15 minutes
    }
    return this.updateOne(updates);
};

// Reset failed login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
    return this.updateOne({
        $set: { failedLoginAttempts: 0, lastLogin: new Date() },
        $unset: { lockUntil: 1 }
    });
};

// Sanitize user object for JSON responses
userSchema.methods.toAuthJSON = function() {
    return {
        id: this._id,
        _id: this._id,
        name: this.name,
        username: this.username,
        email: this.email,
        role: this.role,
        isEmailVerified: this.isEmailVerified,
        avatar: this.avatar,
        university: this.university,
        college: this.college,
        branch: this.branch,
        semester: this.semester,
        xpPoints: this.xpPoints,
        studyStreak: this.studyStreak,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
 