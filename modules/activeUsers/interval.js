require('dotenv').config();
const Sequelize = require('sequelize');
const moment = require('moment');
const table = require('./table');
const { Client } = require('discord.js');
const client = new Client();
const index = require('../..');

client.config = index.config;

exports.run = async () => {
  const usersListQuery = await table.findAll({ attributes: ['user_id', 'user_tag', 'being_active_since', 'has_active_role_since', 'daily_messages_count', 'last_time_being_active'] });
  usersListQuery.map((user) => {
    const dateNow = moment();
    const beingActiveSince = user.being_active_since;
    const hasActiveRoleSince = user.has_active_role_since;
    const dailyMessagesCount = user.daily_messages_count;
    const lastTimeBeingActive = user.last_time_being_active;
    const userId = user.user_id;
    const userTag = user.user_tag;
    // If user started being active
    if ((beingActiveSince !== null) && (dateNow.diff(moment(beingActiveSince), 'days') >= env.process.DAYS_TO_GET_ACTIVE_ROLE) && (hasActiveRoleSince === null)) {
      console.log(`Adding the active role to the user: ${userTag}: ${userId}`);
      manageActiveRole('add', process.env.SERVER_ID, userId, process.env.ACTIVE_ROLE_ID);
      table.update({ has_active_role_since: dateNow.format('YYYY-MM-DD') }, { where: { user_id: userId } });
    }
    // If user was active but then stopped being active
    if ((beingActiveSince !== null) && (dateNow.diff(moment(lastTimeBeingActive), 'days') >= env.process.DAYS_TO_LOSE_ACTIVE_ROLE)) {
      console.log(`Removing the active role from the user: ${userTag}: ${userId}`);
      manageActiveRole('remove', process.env.SERVER_ID, process.env.ACTIVE_ROLE_ID);
      table.update({ has_active_role_since: dateNow.format('YYYY-MM-DD'), being_active_since: null }, { where: { user_id: userId } });
    }
    // Clear all daily messages count for the last day
    if (dailyMessagesCount > 0) {
      table.update({ daily_messages_count: 0 }, { where: { user_id: userId } })
    }
  });
}

client.login(index.config.token);
