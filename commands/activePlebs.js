interval = require('../modules/activeUsers/interval');

exports.run = (bot, msg, args) => {
  interval.run();
  msg.channel.send('Updating active plebs list...');
  console.log('Updating active plebs list...');
};
exports.help = {
  name: 'run',
  usage: 'run',
  description: 'Update active plebs list'
};
