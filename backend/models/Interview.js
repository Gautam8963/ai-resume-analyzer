const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
    },
    role: {
        type: String,
        required: true,
    },
    questions: [{
        question: String,
        userAnswer: String,
        evaluation: {
            score: Number,
            feedback: String,
            keywords: [String],
        },
    }],
    overallScore: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress',
    },
    completedAt: Date,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Interview', interviewSchema);
