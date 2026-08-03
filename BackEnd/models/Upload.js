const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploaderName: {
        type: String,
        required: true
    },
    uploaderEmail: {
        type: String,
        required: true
    },
    uploaderRole: {
        type: String,
        default: 'student'
    },
    // Paper Metadata
    title: {
        type: String,
        required: true,
        trim: true
    },
    university: {
        type: String,
        default: 'SPPU'
    },
    college: {
        type: String,
        default: 'Pune Engineering College'
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    subjectCode: {
        type: String,
        required: true,
        trim: true
    },
    examType: {
        type: String,
        enum: ['End Semester', 'Mid Semester', 'In Semester', 'Quiz', 'Practical', 'Prelim', 'Re-Exam'],
        default: 'End Semester'
    },
    academicYear: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    tags: [{
        type: String
    }],

    // File Details
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'jpg', 'jpeg', 'png'],
        required: true
    },
    fileSize: {
        type: Number, // In bytes
        required: true
    },
    fileHash: {
        type: String, // MD5 or SHA256 string for duplicate check
        index: true
    },

    // Status Workflow
    status: {
        type: String,
        enum: ['pending', 'ai_review', 'approved', 'rejected', 'needs_changes'],
        default: 'pending'
    },

    // AI Verification Engine Analysis Report
    aiAnalysis: {
        qualityScore: {
            type: Number, // 0 - 100
            default: 85
        },
        ocrExtractedText: {
            type: String,
            default: ''
        },
        blurDetected: {
            type: Boolean,
            default: false
        },
        unreadablePagesCount: {
            type: Number,
            default: 0
        },
        missingPagesDetected: {
            type: Boolean,
            default: false
        },
        duplicateCheck: {
            isDuplicate: { type: Boolean, default: false },
            matchedPaperId: { type: String, default: null },
            similarityScore: { type: Number, default: 0 }
        },
        orientation: {
            type: String,
            enum: ['portrait', 'landscape'],
            default: 'portrait'
        },
        recommendation: {
            type: String,
            enum: ['Approve', 'Manual Review', 'Reject'],
            default: 'Manual Review'
        },
        issues: [{
            type: String
        }],
        analyzedAt: {
            type: Date,
            default: Date.now
        }
    },

    // Reviewer/Admin Action Details
    reviewDetails: {
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedByName: {
            type: String,
            default: ''
        },
        reviewedAt: {
            type: Date
        },
        rejectionReason: {
            type: String,
            enum: ['', 'Blurred Content', 'Duplicate Upload', 'Wrong Subject / Metadata', 'Missing Pages', 'Corrupted PDF / Image', 'Spam / Inappropriate Content', 'Other'],
            default: ''
        },
        changeRequestsNotes: {
            type: String,
            default: ''
        },
        adminNotes: {
            type: String,
            default: ''
        }
    },

    // Incentives
    rewardPointsAwarded: {
        type: Number,
        default: 0
    },

    // Public Status
    isPublic: {
        type: Boolean,
        default: false
    },
    publishedPaperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paper'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Upload', uploadSchema);
