const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkLog = sequelize.define('WorkLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  file_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'files',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attendee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attendees',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'work_logs',
  timestamps: false
});

module.exports = WorkLog;