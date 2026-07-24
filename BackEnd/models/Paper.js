const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionNumber: String,
    text: String,
    marks: Number,
    unit: Number,
    chapter: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    frequencyCount: {
        type: Number,
        default: 1
    }
});

const paperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    subjectCode: {
        type: String,
        default: 'CS301'
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    examType: {
        type: String,
        enum: ['End Semester', 'Mid Semester', 'In Semester', 'Quiz', 'Practical'],
        default: 'End Semester'
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    college: {
        type: String,
        default: 'Pune Engineering College'
    },
    university: {
        type: String,
        default: 'SPPU'
    },
    faculty: {
        type: String,
        default: 'Dr. A. K. Sharma'
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
        default: '2.4 MB'
    },
    pdfContentText: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'approved'
    },
    downloadsCount: {
        type: Number,
        default: 1420
    },
    likesCount: {
        type: Number,
        default: 380
    },
    viewsCount: {
        type: Number,
        default: 4590
    },
    tags: [String],
    questions: [questionSchema],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Paper', paperSchema); 