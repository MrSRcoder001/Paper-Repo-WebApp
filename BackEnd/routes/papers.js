const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Paper = require('../models/Paper');
const config = require('../config/config');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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

// Get all papers
router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find().populate('uploadedBy', 'username');
        res.render('papers/index', { 
            title: 'Question Papers',
            papers 
        });
    } catch (error) {
        req.flash('error', 'Error fetching papers');
        res.redirect('/');
    }
});

// Upload paper page
router.get('/upload', isAuthenticated, (req, res) => {
    res.render('papers/upload', { title: 'Upload Paper' });
});

// Handle paper upload
router.post('/upload', isAuthenticated, upload.single('paper'), async (req, res) => {
    try {
        const { title, subject, year, semester, department } = req.body;
        
        const paper = new Paper({
            title,
            subject,
            year,
            semester,
            department,
            filePath: req.file.path,
            uploadedBy: req.session.user._id
        });

        await paper.save();
        req.flash('success', 'Paper uploaded successfully');
        res.redirect('/papers');
    } catch (error) {
        req.flash('error', 'Error uploading paper');
        res.redirect('/papers/upload');
    }
});

// View single paper
router.get('/:id', async (req, res) => {
    try {
        const paper = await Paper.findById(req.params.id).populate('uploadedBy', 'username');
        if (!paper) {
            req.flash('error', 'Paper not found');
            return res.redirect('/papers');
        }
        res.render('papers/show', { 
            title: paper.title,
            paper 
        });
    } catch (error) {
        req.flash('error', 'Error fetching paper');
        res.redirect('/papers');
    }
});

module.exports = router; 