const Resume = require('../models/Resume');
const mlService = require('../utils/mlService');

// Upload and analyze resume
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Parse resume
        const parsedData = await mlService.parseResume(req.file.path);

        // Classify role
        const skills = parsedData.extractedData?.skills || [];
        let roleClassification = { role: 'General', confidence: 0, matchedSkills: [], alternativeRoles: [] };

        if (skills.length > 0) {
            try {
                roleClassification = await mlService.classifyRole(skills);
            } catch (error) {
                console.error('Role classification error:', error);
                // Skip if classification fails
            }
        }

        // Create resume record
        const resume = await Resume.create({
            userId: req.user._id,
            filename: req.file.originalname,
            filepath: req.file.path,
            extractedData: parsedData.extractedData,
            analysis: parsedData.analysis,
            classifiedRole: roleClassification.role,
            roleConfidence: roleClassification.confidence,
            matchedSkills: roleClassification.matchedSkills,
            alternativeRoles: roleClassification.alternativeRoles,
        });

        res.status(201).json({
            message: 'Resume uploaded and analyzed successfully',
            resumeId: resume._id,
        });
    } catch (error) {
        console.error('Upload resume error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
};

// Get resume analysis
exports.getAnalysis = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({ message: 'Failed to get analysis' });
    }
};

// Get user's resume list
exports.getResumeList = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('filename createdAt analysis.score');

        res.json({ resumes });
    } catch (error) {
        console.error('Get resume list error:', error);
        res.status(500).json({ message: 'Failed to get resume list' });
    }
};

// Match resume with job description
exports.matchJobDescription = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!resumeId || !jobDescription) {
            return res.status(400).json({ message: 'Resume ID and job description are required' });
        }

        const resume = await Resume.findOne({
            _id: resumeId,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Get skills from resume
        const resumeSkills = resume.extractedData?.skills || [];

        // Match with job description
        const matchResult = await mlService.matchJobDescription(resumeSkills, jobDescription);

        // Save match result to resume
        resume.jobMatches.push({
            jobDescription,
            matchScore: matchResult.matchScore,
            matchingSkills: matchResult.matchingSkills,
            missingSkills: matchResult.missingSkills,
            recommendations: matchResult.recommendations,
        });

        await resume.save();

        res.json({
            message: 'Job match analysis completed',
            ...matchResult,
        });
    } catch (error) {
        console.error('Match job description error:', error);
        res.status(500).json({ message: 'Failed to match job description', error: error.message });
    }
};
