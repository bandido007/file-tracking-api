const sequelize = require('../config/database');
const Attendee = require('./attendee');
const File = require('./file');
const WorkLog = require('./worklog');

// Define relationships
File.hasMany(WorkLog, { foreignKey: 'file_id' });
WorkLog.belongsTo(File, { foreignKey: 'file_id' });

Attendee.hasMany(WorkLog, { foreignKey: 'attendee_id' });
WorkLog.belongsTo(Attendee, { foreignKey: 'attendee_id' });

module.exports = {
  sequelize,
  Attendee,
  File,
  WorkLog
};