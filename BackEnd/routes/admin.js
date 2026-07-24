const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Paper = require('../models/Paper');
const User = require('../models/User');

// Admin Stats
router.get('/stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const totalUsers = 125430;
        const totalPapers = 245678;
        const totalColleges = 1245;
        const reportsCount = 432;

        res.json({
            totalUsers,
            totalPapers,
            totalColleges,
            reportsCount,
            userGrowth: "+12.5%",
            paperGrowth: "+8.4%",
            collegeGrowth: "+6.2%",
            reportTrend: "+3.1%"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
});

// Admin Pending Uploads List
router.get('/pending-uploads', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const pendingList = [
            {
                id: "p1",
                title: "Data Structures – End Sem – 2024",
                subject: "Data Structures",
                college: "VIT College",
                university: "SPPU",
                year: 2024,
                uploadedBy: "Rahul V.",
                timeAgo: "18 mins ago",
                status: "Approved"
            },
            {
                id: "p2",
                title: "Operating System – Mid Sem – 2024",
                subject: "Operating System",
                college: "VIT College",
                university: "SPPU",
                year: 2024,
                uploadedBy: "Priya S.",
                timeAgo: "25 mins ago",
                status: "Pending"
            },
            {
                id: "p3",
                title: "DBMS – End Sem – 2024",
                subject: "DBMS",
                college: "COEP Pune",
                university: "SPPU",
                year: 2024,
                uploadedBy: "Amit K.",
                timeAgo: "1 hour ago",
                status: "Pending"
            }
        ];

        res.json(pendingList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending uploads' });
    }
});

// Approve/Reject paper
router.post('/paper-status/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        res.json({ message: `Paper status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating paper status' });
    }
});

module.exports = router;
