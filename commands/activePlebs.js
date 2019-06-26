const interval = require('../modules/activeUsers/interval');

exports.run = async (client, message) => {
  if (message.author.bot || !message.guild) {
    return;
  }
  let { content } = message;
  if (!content.startsWith(config.prefix)) {
    return;
  }
  let split = content.substr(config.prefix.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  if (args[0] !== 'update') {
    return;
  };
  let run = await interval.run();
  message.channel.send(`Added Active role to: ${run.added.join(', ')}\nRemoved active role from: ${run.removed.join(', ')}`);
};

exports.help = {
  name: 'activeplebs',
  usage: 'activeplebs',
  description: 'Update active plebs list'
};
