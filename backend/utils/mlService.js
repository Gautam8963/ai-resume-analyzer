const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const mlService = {
    // Parse resume file
    parseResume: async (filepath) => {
        try {
            const FormData = require('form-data');
            const fs = require('fs');

            const formData = new FormData();
            formData.append('file', fs.createReadStream(filepath));

            const response = await axios.post(`${ML_SERVICE_URL}/ml/parse-resume`, formData, {
                headers: formData.getHeaders(),
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Parse Resume Error:', error.message);
            throw new Error('Failed to parse resume');
        }
    },

    // Match job role
    matchJob: async (skills, role) => {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/ml/match-job`, {
                skills,
                role,
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Match Job Error:', error.message);
            throw new Error('Failed to match job');
        }
    },

    // Generate interview questions
    generateQuestions: async (role, skills) => {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/ml/generate-questions`, {
                role,
                skills,
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Generate Questions Error:', error.message);
            throw new Error('Failed to generate questions');
        }
    },

    // Evaluate answer
    evaluateAnswer: async (question, answer, role) => {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/ml/evaluate-answer`, {
                question,
                answer,
                role,
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Evaluate Answer Error:', error.message);
            throw new Error('Failed to evaluate answer');
        }
    },

    // Classify role based on skills
    classifyRole: async (skills) => {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/ml/classify-role`, {
                skills,
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Classify Role Error:', error.message);
            throw new Error('Failed to classify role');
        }
    },

    // Match resume with job description
    matchJobDescription: async (resumeSkills, jobDescription) => {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/ml/match-job-description`, {
                resumeSkills,
                jobDescription,
            });

            return response.data;
        } catch (error) {
            console.error('ML Service - Match Job Description Error:', error.message);
            throw new Error('Failed to match job description');
        }
    },
};

module.exports = mlService;
