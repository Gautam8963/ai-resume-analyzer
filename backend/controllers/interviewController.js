const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const mlService = require('../utils/mlService');

// Start new interview
exports.startInterview = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // Get user's most recent resume for context
        const resume = await Resume.findOne({ userId: req.user._id })
            .sort({ createdAt: -1 });

        const skills = resume?.extractedData?.skills || [];

        // Generate questions using ML service
        const questionsData = await mlService.generateQuestions(role, skills);

        // Create interview record
        const interview = await Interview.create({
            userId: req.user._id,
            resumeId: resume?._id,
            role,
            questions: questionsData.questions.map(q => ({ question: q })),
            status: 'in-progress',
        });

        res.status(201).json({
            message: 'Interview started successfully',
            interviewId: interview._id,
        });
    } catch (error) {
        console.error('Start interview error:', error);
        res.status(500).json({ message: 'Failed to start interview', error: error.message });
    }
};

// Submit answer for evaluation
exports.submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer } = req.body;

        const interview = await Interview.findOne({
            _id: interviewId,
            userId: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (questionIndex >= interview.questions.length) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        // Evaluate answer using ML service
        const question = interview.questions[questionIndex].question;
        const evaluation = await mlService.evaluateAnswer(question, answer, interview.role);

        // Update interview with answer and evaluation
        interview.questions[questionIndex].userAnswer = answer;
        interview.questions[questionIndex].evaluation = evaluation;

        // Check if all questions are answered
        const allAnswered = interview.questions.every(q => q.userAnswer);

        if (allAnswered) {
            // Calculate overall score
            const totalScore = interview.questions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0);
            interview.overallScore = Math.round(totalScore / interview.questions.length);
            interview.status = 'completed';
            interview.completedAt = new Date();
        }

        await interview.save();

        res.json({
            message: 'Answer submitted successfully',
            evaluation,
        });
    } catch (error) {
        console.error('Submit answer error:', error);
        res.status(500).json({ message: 'Failed to submit answer', error: error.message });
    }
};

// Get interview result
exports.getInterviewResult = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        res.json({ interview });
    } catch (error) {
        console.error('Get interview result error:', error);
        res.status(500).json({ message: 'Failed to get interview result' });
    }
};

// Get interview history
exports.getInterviewHistory = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('role overallScore status createdAt questions');

        res.json({ interviews });
    } catch (error) {
        console.error('Get interview history error:', error);
        res.status(500).json({ message: 'Failed to get interview history' });
    }
};
