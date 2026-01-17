const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const interviewController = require('../controllers/interviewController');

// All routes require authentication
router.use(isAuthenticated);

// Start new interview
router.post('/start', interviewController.startInterview);

// Submit answer
router.post('/answer', interviewController.submitAnswer);

// Get interview result
router.get('/result/:id', interviewController.getInterviewResult);

// Get interview history
router.get('/history', interviewController.getInterviewHistory);

module.exports = router;
