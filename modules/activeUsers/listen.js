require('dotenv').config();
const Sequelize = require('sequelize');
const table = require('./table');

exports.listen = async (bot, msg, args) => {
  const date = new Date().toISOString().slice(0, 10);
  idObject = {
    user_id: msg.member.user.id
  };
  const id = await table.findOne({ where: idObject });
  if (id) {
    if (id.get('daily_messages_count') >= process.env.DAILY_MAX_MESSAGES) {
      console.log('User has already reached their daily max messages count, and marked them as being active!');
      await id.update({ being_active_since: date, last_time_being_active: date }, { where: idObject });
      return;
    }
    await id.increment('daily_messages_count');
    await id.update({ last_time_being_active: date }, { where: idObject });
    console.log(`Counted a message from ${msg.member.user.tag}, Their daily total messages is now: ${id.get('daily_messages_count')}`);

  } else {
    try {
      const id = await table.create({
        user_id: msg.member.user.id,
        user_tag: msg.member.user.tag,
        daily_messages_count: 1,
        has_active_role_since: null,
        being_active_since: null,
        last_time_being_active: date
      });
      console.log('Added new user to the database!');
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        console.log('That user already exists.');
      }
      console.log('Something went wrong with adding the user to the database.', e);
    }
  }
};
