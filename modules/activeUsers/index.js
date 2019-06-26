require('dotenv').config();
const Sequelize = require('sequelize');
const moment = require('moment');
const table = require('./table');

exports.run = async (client, message) => {
  if (message.author.bot || !message.guild) {
    return;
  }
  let { content } = message;
  let split = content.substr(process.env.PREFIX.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  const dateNow = moment();
  idObject = {
    user_id: message.member.user.id
  };
  const id = await table.findOne({ where: idObject });
  if (id) {
    if (!(id.get('daily_messages_count') >= process.env.DAILY_MAX_MESSAGES)) {
      await id.increment('daily_messages_count');
      await id.update({ last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });
      console.log(`Counted a message from ${message.member.user.tag}: ${message.member.user.id}, Their daily total messages is now: ${id.get('daily_messages_count') + 1}`);
      return;
    }
    console.log(`User ${message.member.user.tag}: ${message.member.user.id} has already reached their daily max messages count!`);
    if (id.get('being_active_since') === null) {
      await id.update({ being_active_since: dateNow.format('YYYY-MM-DD'), last_time_being_active: dateNow.format('YYYY-MM-DD'), last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });
      return;
    }
    await id.update({ last_time_being_active: dateNow.format('YYYY-MM-DD'), last_message_time: dateNow.format('YYYY-MM-DD') }, { where: idObject });

  } else {
    try {
      const id = await table.create({
        user_id: message.member.user.id,
        user_tag: message.member.user.tag,
        daily_messages_count: 1,
        last_time_being_active: null,
        being_active_since: null,
        last_message_time: dateNow.format('YYYY-MM-DD')
      });
      console.log(`Added a new user ${message.member.user.tag}: ${message.member.user.id} to the database!`);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        console.log('That user already exists.');
      }
      console.log('Something went wrong with adding the user to the database.', e);
    }
  }
};
