// src/routes/fileRoutes.js
const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();

// Check in a file
router.post('/', fileController.checkInFile);

// Get all files
router.get('/', fileController.getAllFiles);

// Get trail log for a file
router.get('/:uuid/logs', fileController.getFileTrailLog);

// Add a new trail log entry
router.post('/:uuid/logs', fileController.addTrailLogEntry);

// Get the last seen location of a file
router.get('/:uuid/last-seen', fileController.getLastSeen);

module.exports = router;