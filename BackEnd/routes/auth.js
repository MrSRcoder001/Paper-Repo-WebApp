const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

// Admin login page
router.get('/admin', (req, res) => {
    res.render('auth/adminLogin', { title: 'Admin Login' });
});

// Login handler
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Welcome back!');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'Something went wrong');
        res.redirect('/login');
    }
});

// Logout handler
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 