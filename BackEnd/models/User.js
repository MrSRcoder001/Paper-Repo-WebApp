const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
        required: true
    },
    name: {
        type: String,
        default: 'Satish Rathod'
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

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 