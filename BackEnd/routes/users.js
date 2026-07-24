const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

// User profile
router.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// Update profile
router.put('/profile', isAuthenticated, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user._id);
        
        if (username) user.username = username;
        if (email) user.email = email;
        
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Change password
router.put('/change-password', isAuthenticated, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password' });
    }
});

// Add to favorites
router.post('/favorites/:paperId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.favorites.includes(req.params.paperId)) {
            user.favorites.push(req.params.paperId);
            await user.save();
        }
        res.json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite' });
    }
});

// Remove from favorites
router.delete('/favorites/:paperId', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.favorites = user.favorites.filter(id => id.toString() !== req.params.paperId);
        await user.save();
        res.json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite' });
    }
});

// Get favorites
router.get('/favorites', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// Admin: Get all users
router.get('/admin/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Admin: Update user role
router.put('/admin/users/:userId/role', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.role = role;
        await user.save();
        res.json({ message: 'User role updated successfully', user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

module.exports = router; 