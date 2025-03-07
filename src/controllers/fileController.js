const { File, WorkLog, Attendee } = require('../models');
const { Op } = require('sequelize');

// Check in a file - create a new file record with UUID
exports.checkInFile = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'File name is required'
      });
    }
    
    // Create a new file with status 'Initiated'
    const file = await File.create({
      name,
      description,
      status: 'Initiated'
    });
    
    return res.status(201).json({
      status: 'success',
      data: {
        tracking_number: file.tracking_number,
        id: file.id,
        name: file.name,
        status: file.status,
        created_time: file.created_time
      }
    });
  } catch (error) {
    console.error('Error checking in file:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to check in file',
      error: error.message
    });
  }
};

// Get trail log for a file
exports.getFileTrailLog = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    // Find the file by UUID
    const file = await File.findOne({
      where: { tracking_number: uuid }
    });
    
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Get all work logs for this file
    const workLogs = await WorkLog.findAll({
      where: { file_id: file.id },
      include: [
        {
          model: Attendee,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: {
        file: {
          id: file.id,
          tracking_number: file.tracking_number,
          name: file.name,
          status: file.status,
          description: file.description,
          created_time: file.created_time,
          updated_time: file.updated_time
        },
        trail_log: workLogs
      }
    });
  } catch (error) {
    console.error('Error getting file trail log:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get file trail log',
      error: error.message
    });
  }
};

// Add a new trail log entry
exports.addTrailLogEntry = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, description, resolution, attendee_id } = req.body;
    
    if (!name || !attendee_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and attendee_id are required'
      });
    }
    
    // Find the file by UUID
    const file = await File.findOne({
      where: { tracking_number: uuid }
    });
    
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Check if file status is 'Completed'
    if (file.status === 'Completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update a completed file'
      });
    }
    
    // Create a new work log entry
    const workLog = await WorkLog.create({
      file_id: file.id,
      name,
      description,
      resolution,
      attendee_id
    });
    
    // Update file status if provided in the request
    if (req.body.status && ['Initiated', 'Processing', 'Completed'].includes(req.body.status)) {
      await file.update({ status: req.body.status });
    }
    
    return res.status(201).json({
      status: 'success',
      data: {
        work_log: workLog,
        file_status: file.status
      }
    });
  } catch (error) {
    console.error('Error adding trail log entry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add trail log entry',
      error: error.message
    });
  }
};

// Get the last seen location of a file
exports.getLastSeen = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    // Find the file by UUID
    const file = await File.findOne({
      where: { tracking_number: uuid }
    });
    
    if (!file) {
      return res.status(404).json({
        status: 'error',
        message: 'File not found'
      });
    }
    
    // Get the most recent work log entry
    const lastWorkLog = await WorkLog.findOne({
      where: { file_id: file.id },
      include: [
        {
          model: Attendee,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // If no work logs found
    if (!lastWorkLog) {
      return res.status(200).json({
        status: 'success',
        data: {
          file: {
            tracking_number: file.tracking_number,
            name: file.name,
            status: file.status
          },
          last_seen: null,
          message: 'File has not been processed yet'
        }
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        file: {
          tracking_number: file.tracking_number,
          name: file.name,
          status: file.status
        },
        last_seen: {
          attendee: lastWorkLog.Attendee,
          work_log: {
            id: lastWorkLog.id,
            name: lastWorkLog.name,
            description: lastWorkLog.description,
            resolution: lastWorkLog.resolution,
            created_at: lastWorkLog.created_at
          }
        }
      }
    });
  } catch (error) {
    console.error('Error getting file last seen:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get file last seen information',
      error: error.message
    });
  }
};