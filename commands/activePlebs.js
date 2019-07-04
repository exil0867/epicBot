const interval = require('../modules/activeUsers/interval');

exports.run = async (bot, msg, args) => {
  if (args[0] !== 'update') {
    return;
  };
  let run = await interval.run();
  msg.channel.send(`Added Active role to: ${run.added.join(', ')}\nRemoved active role from: ${run.removed.join(', ')}`);
};

exports.help = {
  name: 'ap',
  usage: 'ap',
  description: 'Update active plebs list'
};
