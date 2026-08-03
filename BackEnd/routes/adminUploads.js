const express = require('express');
const router = express.Router();

const { isAuthenticated: authenticate, authorize } = require('../middleware/auth');
const Upload = require('../models/Upload');
const Paper = require('../models/Paper');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// All endpoints in this router require Admin or Moderator role
const requireAdminOrModerator = [authenticate, authorize(['admin', 'college_admin', 'faculty'])];

/**
 * @route   GET /api/admin/uploads
 * @desc    Get list of paper upload submissions with filters & search
 * @access  Protected (Admin/Faculty/Moderator)
 */
router.get('/', requireAdminOrModerator, async (req, res) => {
    try {
        const { status, search, branch, semester } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (branch) {
            query.branch = branch;
        }

        if (semester) {
            query.semester = Number(semester);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { subjectCode: { $regex: search, $options: 'i' } },
                { uploaderName: { $regex: search, $options: 'i' } },
                { uploaderEmail: { $regex: search, $options: 'i' } }
            ];
        }

        const uploads = await Upload.find(query).sort({ createdAt: -1 });

        // Calculate studio summary stats
        const stats = {
            total: await Upload.countDocuments(),
            pending: await Upload.countDocuments({ status: 'pending' }),
            approved: await Upload.countDocuments({ status: 'approved' }),
            rejected: await Upload.countDocuments({ status: 'rejected' }),
            needsChanges: await Upload.countDocuments({ status: 'needs_changes' })
        };

        res.json({
            success: true,
            stats,
            count: uploads.length,
            uploads
        });

    } catch (error) {
        console.error('Error fetching admin uploads queue:', error);
        res.status(500).json({ success: false, message: 'Server error fetching uploads' });
    }
});

/**
 * @route   GET /api/admin/uploads/:id
 * @desc    Get single upload details, AI analysis report & audit log
 * @access  Protected (Admin)
 */
router.get('/:id', requireAdminOrModerator, async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        const auditLogs = await AuditLog.find({ targetUploadId: upload._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            upload,
            auditLogs
        });
    } catch (error) {
        console.error('Error fetching upload detail:', error);
        res.status(500).json({ success: false, message: 'Server error fetching upload detail' });
    }
});

/**
 * @route   PUT /api/admin/uploads/:id/approve
 * @desc    Approve upload submission -> Make paper public, award XP points, notify uploader
 * @access  Protected (Admin)
 */
router.put('/:id/approve', requireAdminOrModerator, async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        // 1. Create or update published Paper document
        const newPaper = new Paper({
            title: upload.title,
            subject: upload.subject,
            subjectCode: upload.subjectCode,
            year: Number(upload.academicYear.split('-')[0]) || new Date().getFullYear(),
            semester: upload.semester,
            examType: upload.examType,
            department: upload.branch,
            college: upload.college,
            university: upload.university,
            filePath: upload.fileUrl,
            fileSize: `${(upload.fileSize / (1024 * 1024)).toFixed(1)} MB`,
            pdfContentText: upload.aiAnalysis?.ocrExtractedText || '',
            status: 'approved',
            tags: upload.tags,
            uploadedBy: upload.uploaderId,
            uploadDate: new Date()
        });

        await newPaper.save();

        // 2. Update Upload Document status
        upload.status = 'approved';
        upload.isPublic = true;
        upload.publishedPaperId = newPaper._id;
        upload.rewardPointsAwarded = 50; // Award 50 XP
        upload.reviewDetails = {
            reviewedBy: req.user._id,
            reviewedByName: req.user.name || req.user.username || 'Admin',
            reviewedAt: new Date(),
            rejectionReason: '',
            changeRequestsNotes: '',
            adminNotes: req.body.adminNotes || 'Approved and published to public repository.'
        };

        await upload.save();

        // 3. Award XP Points to Student User
        let updatedXp = 1300;
        const uploader = await User.findById(upload.uploaderId);
        if (uploader) {
            uploader.xpPoints = (uploader.xpPoints || 1250) + 50;
            await uploader.save();
            updatedXp = uploader.xpPoints;
        }

        // 4. Send Notification to Student
        await new Notification({
            recipientId: upload.uploaderId,
            title: 'Upload Approved & +50 XP Awarded! 🎉',
            message: `Congratulations! Your question paper "${upload.title}" was approved & published! You earned +50 XP bonus (Total: ${updatedXp} XP).`,
            type: 'upload_approved',
            relatedUploadId: upload._id
        }).save();

        // 5. Record Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role,
            action: 'UPLOAD_APPROVED',
            targetUploadId: upload._id,
            details: {
                paperTitle: upload.title,
                rewardPoints: 50,
                publishedPaperId: newPaper._id
            }
        }).save();

        res.json({
            success: true,
            message: 'Paper approved successfully and published to repository! 50 XP awarded to student.',
            upload,
            publishedPaperId: newPaper._id
        });

    } catch (error) {
        console.error('Error approving paper upload:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error approving paper' });
    }
});

/**
 * @route   PUT /api/admin/uploads/:id/reject
 * @desc    Reject upload submission with reason
 * @access  Protected (Admin)
 */
router.put('/:id/reject', requireAdminOrModerator, async (req, res) => {
    try {
        const { rejectionReason, adminNotes } = req.body;
        if (!rejectionReason) {
            return res.status(400).json({ success: false, message: 'Please select a reason for rejection.' });
        }

        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        upload.status = 'rejected';
        upload.isPublic = false;
        upload.reviewDetails = {
            reviewedBy: req.user._id,
            reviewedByName: req.user.name || req.user.username || 'Admin',
            reviewedAt: new Date(),
            rejectionReason,
            changeRequestsNotes: '',
            adminNotes: adminNotes || ''
        };

        await upload.save();

        // Send Notification to Student
        await new Notification({
            recipientId: upload.uploaderId,
            title: 'Upload Decision: Rejected ⚠️',
            message: `Your paper upload "${upload.title}" was not approved. Reason: ${rejectionReason}.`,
            type: 'upload_rejected',
            relatedUploadId: upload._id
        }).save();

        // Record Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role,
            action: 'UPLOAD_REJECTED',
            targetUploadId: upload._id,
            details: { rejectionReason, adminNotes }
        }).save();

        res.json({
            success: true,
            message: 'Submission rejected successfully and notification sent to student.',
            upload
        });

    } catch (error) {
        console.error('Error rejecting paper upload:', error);
        res.status(500).json({ success: false, message: 'Server error rejecting paper' });
    }
});

/**
 * @route   PUT /api/admin/uploads/:id/request-changes
 * @desc    Request changes from student uploader
 * @access  Protected (Admin)
 */
router.put('/:id/request-changes', requireAdminOrModerator, async (req, res) => {
    try {
        const { changeRequestsNotes } = req.body;
        if (!changeRequestsNotes) {
            return res.status(400).json({ success: false, message: 'Please provide instructions detailing what changes are required.' });
        }

        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        upload.status = 'needs_changes';
        upload.reviewDetails = {
            reviewedBy: req.user._id,
            reviewedByName: req.user.name || req.user.username || 'Admin',
            reviewedAt: new Date(),
            rejectionReason: '',
            changeRequestsNotes,
            adminNotes: req.body.adminNotes || ''
        };

        await upload.save();

        // Send Notification to Student
        await new Notification({
            recipientId: upload.uploaderId,
            title: 'Changes Requested for Upload 📝',
            message: `Moderators requested changes for "${upload.title}". Note: "${changeRequestsNotes}". Please replace the file from your uploads history.`,
            type: 'changes_requested',
            relatedUploadId: upload._id
        }).save();

        // Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role,
            action: 'CHANGES_REQUESTED',
            targetUploadId: upload._id,
            details: { changeRequestsNotes }
        }).save();

        res.json({
            success: true,
            message: 'Change request sent to student uploader successfully.',
            upload
        });

    } catch (error) {
        console.error('Error requesting changes:', error);
        res.status(500).json({ success: false, message: 'Server error requesting changes' });
    }
});

/**
 * @route   PUT /api/admin/uploads/:id/edit-metadata
 * @desc    Edit metadata of an upload submission
 * @access  Protected (Admin)
 */
router.get('/:id/edit-metadata', requireAdminOrModerator, async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        const allowedFields = ['title', 'subject', 'subjectCode', 'branch', 'semester', 'examType', 'academicYear', 'description', 'university', 'college'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                upload[field] = req.body[field];
            }
        });

        await upload.save();

        // Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role,
            action: 'METADATA_EDITED',
            targetUploadId: upload._id,
            details: req.body
        }).save();

        res.json({
            success: true,
            message: 'Upload metadata updated successfully.',
            upload
        });

    } catch (error) {
        console.error('Error updating metadata:', error);
        res.status(500).json({ success: false, message: 'Server error updating metadata' });
    }
});

/**
 * @route   DELETE /api/admin/uploads/:id
 * @desc    Delete upload submission
 * @access  Protected (Admin)
 */
router.delete('/:id', requireAdminOrModerator, async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload submission not found' });
        }

        await Upload.findByIdAndDelete(req.params.id);

        // Audit Log
        await new AuditLog({
            actorId: req.user._id,
            actorName: req.user.name || req.user.username,
            actorRole: req.user.role,
            action: 'UPLOAD_DELETED',
            targetUploadId: req.params.id,
            details: { title: upload.title }
        }).save();

        res.json({
            success: true,
            message: 'Upload record deleted successfully.'
        });

    } catch (error) {
        console.error('Error deleting upload:', error);
        res.status(500).json({ success: false, message: 'Server error deleting upload' });
    }
});

module.exports = router;
