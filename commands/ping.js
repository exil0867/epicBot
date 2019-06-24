exports.run = async (bot, msg, args) => {
  const ping = await msg.channel.send('Ok! Pinging...');
  ping.edit(`Pong! Latency is ${ping.createdTimestamp - msg.createdTimestamp}ms. The API latency is ${Math.round(bot.ping)}ms`)
};

exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'Calculates bot and API latency'
};
