interval = require('../modules/activeUsers/interval');

exports.run = (bot, msg, args) => {
  interval.run();
  msg.channel.send('ok!');
};
exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'pings the bot'
};
