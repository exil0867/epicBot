require('dotenv').config();
const Sequelize = require('sequelize');
const moment = require('moment');
const table = require('./table');

exports.listen = (bot, msg, args) => {
  const dateNow = moment();
  idObject = {
    user_id: msg.member.user.id
  };
  const id = table.findOne({ where: idObject });
  if (id) {
    if (!(id.get('daily_messages_count') >= process.env.DAILY_MAX_MESSAGES)) {
      id.increment('daily_messages_count');
      id.update({ last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });
      console.log(`Counted a message from ${msg.member.user.tag}: ${msg.member.user.id}, Their daily total messages is now: ${id.get('daily_messages_count') + 1}`);
      return;
    }
    console.log(`User ${msg.member.user.tag}: ${msg.member.user.id} has already reached their daily max messages count!`);
    if (id.get('being_active_since') === null) {
      id.update({ being_active_since: dateNow.format('YYYY-MM-DD'), last_time_being_active: dateNow.format('YYYY-MM-DD'), last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });
      return;
    }
    id.update({ last_time_being_active: dateNow.format('YYYY-MM-DD'), last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });

  } else {
    try {
      const id = table.create({
        user_id: msg.member.user.id,
        user_tag: msg.member.user.tag,
        daily_messages_count: 1,
        last_time_being_active: null,
        being_active_since: null,
        last_message_time: dateNow.format('YYYY-MM-DD')
      });
      console.log(`Added a new user ${msg.member.user.tag}: ${msg.member.user.id} to the database!`);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        console.log('That user already exists.');
      }
      console.log('Something went wrong with adding the user to the database.', e);
    }
  }
};
