interval = require('../modules/activeUsers/interval');

exports.run = (bot, msg, args) => {
  if (args[0] !== 'update') {
    return;
  }
  interval.run();
  msg.channel.send('Updating active plebs list...');
  console.log('Updating active plebs list...');
};
exports.help = {
  name: 'activeplebs',
  usage: 'activeplebs',
  description: 'Update active plebs list'
};
