require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

const table = sequelize.define(process.env.ACTIVE_USERS_TABLE_NAME, {
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
