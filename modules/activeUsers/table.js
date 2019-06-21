const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const table = sequelize.define('active_plebs', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  user_tag: {
    type: Sequelize.STRING
  },
  daily_messages_count: {
    type: Sequelize.INTEGER
  },
  has_active_role_since: {
    type: Sequelize.STRING
  },
  last_time_being_active: {
    type: Sequelize.STRING
  },
  being_active_since: {
    type: Sequelize.STRING
  },
  last_message_time: {
    type: Sequelize.STRING
  }
});

module.exports = table;
