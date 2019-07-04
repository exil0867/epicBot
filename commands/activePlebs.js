const interval = require('../modules/activeUsers/interval');

exports.run = (bot, msg, args) => {
  if (args[0] !== 'update') {
    return;
  };
  let run = interval.run();
  let result = {
    added: run.added.join(', '),
    removed: run.removed.join(', ')
  }
  msg.channel.send(`Added Active role to: ${result.added}\nRemoved active role from: ${result.removed}`);
};

exports.help = {
  name: 'activeplebs',
  usage: 'activeplebs',
  description: 'Update active plebs list'
};
