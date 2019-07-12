require('dotenv').config();
const Sequelize = require('sequelize');
const moment = require('moment');
const table = require('./table');
const functions = require('./functions');
const { Client } = require('discord.js');
const client = new Client();

exports.run = async () => {
  let result = {
    added: [],
    removed: []
  };
  const usersListQuery = await table.findAll({ attributes: ['user_id', 'user_tag', 'being_active_since', 'daily_messages_count', 'last_time_being_active'] });
  usersListQuery.map((user) => {
    const dateNow = moment();
    const beingActiveSince = user.being_active_since;
    const dailyMessagesCount = user.daily_messages_count;
    const lastTimeBeingActive = user.last_time_being_active;
    const userId = user.user_id;
    const userTag = user.user_tag;
    // If user exists in the server
    if (!client.guilds.get(process.env.SERVER_ID).members.has(userId)) {
      table.destroy({ where: { user_id: userId } });
      return;
    }
    // If user started being active
    if (beingActiveSince == null) {
      return;
    }
    if (dateNow.diff(moment(beingActiveSince), 'days') >= process.env.DAYS_TO_GET_ACTIVE_ROLE) {
      console.log(`Adding the active role to the user: ${userTag}: ${userId}`);
      functions.manageActiveRole('add', process.env.SERVER_ID, userId, process.env.ACTIVE_ROLE_ID);
      result.added.push(`<@${userId}>`);
    }
    // If user was active but then stopped being active
    else if (dateNow.diff(moment(lastTimeBeingActive), 'days') >= process.env.DAYS_TO_LOSE_ACTIVE_ROLE) {
      console.log(`Removing the active role from the user: ${userTag}: ${userId}`);
      functions.manageActiveRole('remove', process.env.SERVER_ID, userId, process.env.ACTIVE_ROLE_ID);
      result.removed.push(`<@${userId}>`);
      table.destroy({ where: { user_id: userId } });
    }
    // Clear all daily messages count for the last day
    if (dailyMessagesCount > 0) {
      table.update({ daily_messages_count: 0 }, { where: { user_id: userId } })
    }
  });
  return result;
}

client.login(process.env.TOKEN);
