const express = require('express');
const router = express.Router();

const { isAuthenticated: authenticate } = require('../middleware/auth');
const Notification = require('../models/Notification');

/**
 * @route   GET /api/notifications
 * @desc    Get logged in user notifications
 * @access  Protected
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30);

        const unreadCount = await Notification.countDocuments({
            recipientId: req.user._id,
            isRead: false
        });

        res.json({
            success: true,
            unreadCount,
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Server error fetching notifications' });
    }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all user notifications as read
 * @access  Protected
 */
router.put('/read-all', authenticate, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ success: false, message: 'Server error updating notifications' });
    }
});

module.exports = router;
