const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { isAuthenticated: authenticate } = require('../middleware/auth');
const Upload = require('../models/Upload');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const AIVerificationService = require('../services/aiVerificationService');

// Multer storage setup
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `paper-${uniqueSuffix}${ext}`);
    }
});

const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file format. Only PDF, JPG, and PNG files are allowed.'));
        }
    }
});

/**
 * @route   POST /api/uploads
 * @desc    Upload a new question paper (Student/User)
 * @access  Protected
 */
router.post('/', authenticate, uploadMiddleware.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select a question paper file to upload.' });
        }

        const {
            title,
            university,
            college,
            branch,
            semester,
            subject,
            subjectCode,
            examType,
            academicYear,
            description,
            tags
        } = req.body;

        if (!title || !branch || !semester || !subject || !subjectCode || !academicYear) {
            return res.status(400).json({ success: false, message: 'Please fill in all required paper metadata fields.' });
        }

        // Read file buffer for AI Analysis & MD5 hash check
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();

        // Run AI Verification Service
        const aiResults = await AIVerificationService.analyzePaper(
            {
                buffer: fileBuffer,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            },
            {
                subject,
                subjectCode,
                semester: Number(semester),
                examType: examType || 'End Semester',
                academicYear,
                branch
            }
        );

        // Relative URL path for file serving
        const fileUrl = `/uploads/${req.file.filename}`;

        // Process tags array
        let parsedTags = [];
        if (typeof tags === 'string') {
            parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        } else if (Array.isArray(tags)) {
            parsedTags = tags;
        }

        // Create new Upload Document
        const newUpload = new Upload({
            uploaderId: req.user._id,
            uploaderName: req.user.name || req.user.username || 'Student',
            uploaderEmail: req.user.email,
            uploaderRole: req.user.role || 'student',
            title,
            university: university || 'SPPU',
            college: college || 'Pune Engineering College',
            branch,
            semester: Number(semester),
            subject,
            subjectCode,
            examType: examType || 'End Semester',
            academicYear,
            description: description || '',
            tags: parsedTags,
            fileUrl,
            fileName: req.file.originalname,
            fileType: fileExt,
            fileSize: req.file.size,
            fileHash: aiResults.fileHash,
            status: 'pending',
            aiAnalysis: {
                qualityScore: aiResults.qualityScore,
                ocrExtractedText: aiResults.ocrExtractedText,
                blurDetected: aiResults.blurDetected,
                unreadablePagesCount: aiResults.unreadablePagesCount,
                missingPagesDetected: aiResults.missingPagesDetected,
                duplicateCheck: aiResults.duplicateCheck,
                orientation: aiResults.orientation,
                recommendation: aiResults.recommendation,
                issues: aiResults.issues
            }
        });

        await newUpload.save();

        // Award +50 XP to uploading student
        let updatedXpPoints = 1300;
        const uploader = await User.findById(req.user._id);
        if (uploader) {
            uploader.xpPoints = (uploader.xpPoints || 1250) + 50;
            await uploader.save();
            updatedXpPoints = uploader.xpPoints;
        }

        // Create Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role || 'student',
            action: 'UPLOAD_SUBMITTED',
            targetUploadId: newUpload._id,
            details: {
                title: newUpload.title,
                subject: newUpload.subject,
                fileSize: newUpload.fileSize,
                aiScore: aiResults.qualityScore,
                xpAwarded: 50
            }
        }).save();

        // Create In-App Notification
        await new Notification({
            recipientId: req.user._id,
            title: 'Question Paper Uploaded! +50 XP Earned 🎉',
            message: `Your paper "${title}" has been uploaded and queued for verification. You earned +50 XP! Total XP: ${updatedXpPoints}.`,
            type: 'reward_earned',
            relatedUploadId: newUpload._id
        }).save();

        res.status(201).json({
            success: true,
            message: 'Question paper submitted successfully! Earned +50 XP 🎉',
            upload: newUpload,
            xpEarned: 50,
            xpPoints: updatedXpPoints
        });

    } catch (error) {
        console.error('Error submitting paper upload:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error uploading file' });
    }
});

/**
 * @route   GET /api/uploads/my-uploads
 * @desc    Get all upload submissions by the logged-in student
 * @access  Protected
 */
router.get('/my-uploads', authenticate, async (req, res) => {
    try {
        const uploads = await Upload.find({ uploaderId: req.user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: uploads.length,
            uploads
        });
    } catch (error) {
        console.error('Error fetching student uploads:', error);
        res.status(500).json({ success: false, message: 'Server error fetching uploads' });
    }
});

/**
 * @route   PUT /api/uploads/:id/replace
 * @desc    Replace file for a submission marked 'needs_changes'
 * @access  Protected
 */
router.put('/:id/replace', authenticate, uploadMiddleware.single('file'), async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        if (upload.uploaderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to replace file for this upload' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select a replacement file.' });
        }

        const fileBuffer = fs.readFileSync(req.file.path);
        const fileExt = path.extname(req.file.originalname).replace('.', '').toLowerCase();

        // Run AI Verification on new file
        const aiResults = await AIVerificationService.analyzePaper(
            {
                buffer: fileBuffer,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            },
            {
                subject: upload.subject,
                subjectCode: upload.subjectCode,
                semester: upload.semester,
                examType: upload.examType,
                academicYear: upload.academicYear,
                branch: upload.branch
            }
        );

        upload.fileUrl = `/uploads/${req.file.filename}`;
        upload.fileName = req.file.originalname;
        upload.fileType = fileExt;
        upload.fileSize = req.file.size;
        upload.fileHash = aiResults.fileHash;
        upload.status = 'pending'; // Reset back to pending for re-review
        upload.aiAnalysis = {
            qualityScore: aiResults.qualityScore,
            ocrExtractedText: aiResults.ocrExtractedText,
            blurDetected: aiResults.blurDetected,
            unreadablePagesCount: aiResults.unreadablePagesCount,
            missingPagesDetected: aiResults.missingPagesDetected,
            duplicateCheck: aiResults.duplicateCheck,
            orientation: aiResults.orientation,
            recommendation: aiResults.recommendation,
            issues: aiResults.issues,
            analyzedAt: new Date()
        };

        await upload.save();

        // Audit Log & Notification
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role || 'student',
            action: 'FILE_REPLACED',
            targetUploadId: upload._id,
            details: { newFileName: req.file.originalname }
        }).save();

        await new Notification({
            recipientId: req.user._id,
            title: 'File Replaced & Resubmitted 🔄',
            message: `Your updated file for "${upload.title}" has been resubmitted for admin review.`,
            type: 'system',
            relatedUploadId: upload._id
        }).save();

        res.json({
            success: true,
            message: 'Replacement file submitted successfully and re-queued for review!',
            upload
        });

    } catch (error) {
        console.error('Error replacing upload file:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error replacing file' });
    }
});

module.exports = router;
