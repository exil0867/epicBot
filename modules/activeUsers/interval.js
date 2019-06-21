require('dotenv').config();
const Sequelize = require('sequelize');
const moment = require('moment');
const table = require('./table');
const ind = require('../../index.js');
const { Client } = require('discord.js');
const client = new Client();
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX
};

client.config = config;

async function manageActiveRole(action, serverId, memberId, roleId) {
  const member = client.guilds.get(serverId).members.get(memberId);
  if (action === 'add') {
    if (!member.roles.has(roleId)) {
      member.addRole(roleId).then(() => {
        console.log('Added the role to the user');
      }).catch((error) => {
        console.error(error);
      });
    } else {
      console.log('The user already has the role!');
    }
  }
  if (action === 'remove') {
    if (member.roles.has(roleId)) {
      member.removeRole(roleId).then(() => {
        console.log('Removed the role from the user!');
      }).catch((error) => {
        console.log(error);
        console.log(`Couldn't remove the role from the user!`);
      });
    } else {
      console.log(`The user already doesn't have the role!`);
    }
  }
}


exports.run = async () => {
  const usersListQuery = await table.findAll({ attributes: ['user_id', 'being_active_since', 'has_active_role_since', 'daily_messages_count', 'last_time_being_active'] });
  usersListQuery.map((user) => {
    const dateNow = moment();
    const beingActiveSince = user.being_active_since;
    const hasActiveRoleSince = user.has_active_role_since;
    const dailyMessagesCount = user.daily_messages_count;
    const lastTimeBeingActive = user.last_time_being_active;
    const userId = user.user_id;
    // If user started being active
    if ((beingActiveSince !== null) && (dateNow.diff(moment(beingActiveSince), 'days') >= env.process.DAYS_TO_GET_ACTIVE_ROLE) && (hasActiveRoleSince === null)) {
      console.log(`Adding the active role to the user: ${userId}`)
      manageActiveRole('add', process.env.SERVER_ID, userId, process.env.ACTIVE_ROLE_ID);
      table.update({ has_active_role_since: dateNow.format('YYYY-MM-DD') }, { where: { user_id: userId } });
    }
    // If user was active but then stopped being active
    if ((beingActiveSince !== null) && (dateNow.diff(moment(lastTimeBeingActive), 'days') >= env.process.DAYS_TO_LOSE_ACTIVE_ROLE)) {
      console.log(`Removing the active role from the user: ${userId}`)
      manageActiveRole('remove', process.env.SERVER_ID, , process.env.ACTIVE_ROLE_ID);
      table.update({ has_active_role_since: dateNow.format('YYYY-MM-DD'), being_active_since: null }, { where: { user_id: userId } });
    }
    // Clear all daily messages count for the last day
    if (dailyMessagesCount > 0) {
      table.update({ daily_messages_count: 0 }, { where: { user_id: userId } })
    }
  });
}

client.login(config.token);