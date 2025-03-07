const { Attendee } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new attendee
exports.register = async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    
    // Check if all required fields are provided
    if (!email || !name || !role || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, name, role, and password are required'
      });
    }
    
    // Check if attendee already exists
    const existingAttendee = await Attendee.findOne({ where: { email } });
    if (existingAttendee) {
      return res.status(400).json({
        status: 'error',
        message: 'Attendee with this email already exists'
      });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new attendee
    const attendee = await Attendee.create({
      email,
      name,
      role,
      password: hashedPassword
    });
    
    // Return the new attendee (without password)
    return res.status(201).json({
      status: 'success',
      data: {
        id: attendee.id,
        email: attendee.email,
        name: attendee.name,
        role: attendee.role
      }
    });
  } catch (error) {
    console.error('Error registering attendee:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to register attendee',
      error: error.message
    });
  }
};

// Login an attendee
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if all required fields are provided
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }
    
    // Find the attendee by email
    const attendee = await Attendee.findOne({ where: { email } });
    if (!attendee) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, attendee.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: attendee.id, email: attendee.email, role: attendee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return token and attendee info
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        attendee: {
          id: attendee.id,
          email: attendee.email,
          name: attendee.name,
          role: attendee.role
        }
      }
    });
  } catch (error) {
    console.error('Error logging in attendee:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      error: error.message
    });
  }
};

// Get attendee profile
exports.getProfile = async (req, res) => {
  try {
    const attendeeId = req.attendee.id;
    
    // Find the attendee by ID
    const attendee = await Attendee.findByPk(attendeeId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!attendee) {
      return res.status(404).json({
        status: 'error',
        message: 'Attendee not found'
      });
    }
    
    // Return attendee info
    return res.status(200).json({
      status: 'success',
      data: attendee
    });
  } catch (error) {
    console.error('Error getting attendee profile:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get profile',
      error: error.message
    });
  }
};