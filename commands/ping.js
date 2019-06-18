exports.run = (bot, msg, args) => {
  msg.channel.send('Pong!');
};
exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'pings the bot'
};
