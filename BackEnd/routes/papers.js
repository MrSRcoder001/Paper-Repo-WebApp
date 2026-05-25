const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Paper = require('../models/Paper');
const config = require('../config/config');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure upload directory exists
        if (!fs.existsSync(config.uploadPath)){
            fs.mkdirSync(config.uploadPath, { recursive: true });
        }
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (config.allowedFileTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Get all papers (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { branch, semester, year } = req.query;
        let query = {};
        
        if (branch) query.department = branch;
        if (semester) query.semester = semester;
        if (year) query.year = year;

        const papers = await Paper.find(query).populate('uploadedBy', 'username');
        res.json(papers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching papers' });
    }
});

// Handle paper upload
router.post('/upload', isAuthenticated, upload.single('paper'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { title, subject, year, semester, department } = req.body;
        
        const paper = new Paper({
            title,
            subject,
            year,
            semester,
            department,
            filePath: req.file.path,
            uploadedBy: req.user._id
        });

        await paper.save();
        res.status(201).json({ message: 'Paper uploaded successfully', paper });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading paper' });
    }
});

// View single paper
router.get('/:id', async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id).populate('uploadedBy', 'username');
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.json(paper);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paper' });
    }
});

// Delete paper
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        
        // Delete file from filesystem
        if (fs.existsSync(paper.filePath)) {
            fs.unlinkSync(paper.filePath);
        }
        
        await Paper.findByIdAndDelete(req.params.id);
        
        // Also remove this paper from any user's favorites
        const User = require('../models/User');
        await User.updateMany(
            { favorites: req.params.id },
            { $pull: { favorites: req.params.id } }
        );
        
        res.json({ message: 'Paper deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting paper' });
    }
});

module.exports = router; 