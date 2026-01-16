const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    filepath: {
        type: String,
        required: true,
    },
    extractedData: {
        name: String,
        email: String,
        skills: [String],
        experience: String,
    },
    analysis: {
        score: Number,
        strengths: [String],
        improvements: [String],
        missingSkills: [String],
    },
    classifiedRole: {
        type: String,
        default: 'General',
    },
    roleConfidence: {
        type: Number,
        default: 0,
    },
    matchedSkills: [String],
    alternativeRoles: [{
        role: String,
        score: Number,
    }],
    jobMatches: [{
        jobDescription: String,
        matchScore: Number,
        matchingSkills: [String],
        missingSkills: [String],
        recommendations: [String],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
