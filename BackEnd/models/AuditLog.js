const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actorName: {
        type: String,
        required: true
    },
    actorRole: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: [
            'UPLOAD_SUBMITTED', 
            'AI_VERIFICATION_COMPLETED', 
            'UPLOAD_APPROVED', 
            'UPLOAD_REJECTED', 
            'CHANGES_REQUESTED', 
            'FILE_REPLACED', 
            'METADATA_EDITED', 
            'UPLOAD_DELETED'
        ],
        required: true
    },
    targetUploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
