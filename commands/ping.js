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
  const ping = await message.channel.send('Ok! Pinging...');
  ping.edit(`Pong! Latency is ${ping.createdTimestamp - message.createdTimestamp}ms. The API latency is ${Math.round(client.ping)}ms`)
};

exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'Calculates bot and API latency'
};
