require('dotenv').config();
const Sequelize = require('sequelize');
const table = require('./table');

function daysDiff(firstDate, secondDate) {
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (24 * 60 * 60 * 1000)));
}

exports.run = async () => {
  const usersListQuery = await table.findAll({ attributes: ['user_id', 'being_active_since', 'has_active_role_since', 'daily_messages_count'] });
  usersListQuery.map( (user) => {
    const dateNow = new Date();
    const beingActiveSince = user.being_active_since;
    const hasActiveRoleSince = user.has_active_role_since;
    const dailyMessagesCount = user.daily_messages_count;
    const userId = user.user_id;
    if ((beingActiveSince !== null) && (daysDiff(new Date(), new Date(beingActiveSince)) >= 5)) {
      console.log(`Detected user ${user.user_id} as being active. Will add the role!`);
    }
    if ((hasActiveRoleSince !== null) && (beingActiveSince !== null)(daysDiff(new Date(), new Date(beingActiveSince)) <= 5)) {
      console.log(`Detected user ${user.user_id} as not being active. Will remove the role!`);
    }
    if (dailyMessagesCount > 0) {
      table.update({ daily_messages_count: 0 }, { where: { user_id: userId } })
    }
  });
}
