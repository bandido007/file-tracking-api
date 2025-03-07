// src/routes/attendeeRoutes.js
const express = require('express');
const attendeeController = require('../controllers/attendeeController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Register a new attendee
router.post('/register', attendeeController.register);

// Login an attendee
router.post('/login', attendeeController.login);

// Get attendee profile (protected route)
router.get('/profile', authenticate, attendeeController.getProfile);

module.exports = router;