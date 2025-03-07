// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Attendee } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find attendee by ID
    const attendee = await Attendee.findByPk(decoded.id);
    if (!attendee) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token - user not found'
      });
    }
    
    // Add attendee info to request object
    req.attendee = {
      id: attendee.id,
      email: attendee.email,
      role: attendee.role
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};