const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

// Register handler
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // If it's the first user, make them an admin
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';

        const user = new User({ username, email, password, role });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwtSecret,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email,
                favorites: user.favorites
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login handler
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwtSecret,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email,
                favorites: user.favorites
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router; 