const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const resumeController = require('../controllers/resumeController');

// All routes require authentication
router.use(isAuthenticated);

// Upload resume
router.post('/upload', upload.single('resume'), resumeController.uploadResume);

// Get analysis by ID
router.get('/analysis/:id', resumeController.getAnalysis);

// Get user's resume list
router.get('/list', resumeController.getResumeList);

// Match resume with job description
router.post('/match-job', resumeController.matchJobDescription);

module.exports = router;
