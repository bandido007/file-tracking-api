const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tracking_number: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Initiated', 'Processing', 'Completed']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'files',
  timestamps: false,
  hooks: {
    beforeUpdate: (file) => {
      file.updated_time = new Date();
    }
  }
});

module.exports = File;