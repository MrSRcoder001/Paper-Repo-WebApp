const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

// User profile
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('users/profile', {
        title: 'My Profile',
        user: req.session.user
    });
});

// Update profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.session.user._id);
        
        if (username) user.username = username;
        if (email) user.email = email;
        
        await user.save();
        req.session.user = user;
        req.flash('success', 'Profile updated successfully');
        res.redirect('/users/profile');
    } catch (error) {
        req.flash('error', 'Error updating profile');
        res.redirect('/users/profile');
    }
});

// Change password
router.put('/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.session.user._id);
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect('/users/profile');
        }
        
        user.password = newPassword;
        await user.save();
        
        req.flash('success', 'Password changed successfully');
        res.redirect('/users/profile');
    } catch (error) {
        req.flash('error', 'Error changing password');
        res.redirect('/users/profile');
    }
});

// Admin routes
router.get('/admin', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/admin', {
            title: 'User Management',
            users
        });
    } catch (error) {
        req.flash('error', 'Error fetching users');
        res.redirect('/');
    }
});

module.exports = router; 