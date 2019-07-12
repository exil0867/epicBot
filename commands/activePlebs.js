require('dotenv').config();
const interval = require('../modules/activeUsers/interval');
const { RichEmbed } = require('discord.js');

exports.run = async (client, message) => {
  if (message.author.bot || !message.guild) {
    return;
  }
  let { content } = message;
  if (!content.startsWith(process.env.PREFIX)) {
    return;
  }
  let split = content.substr(process.env.PREFIX.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  if (args[0] !== 'update') {
    return;
  };
  let run = await interval.run();
  let feedbackEmbed = new RichEmbed()
  .setColor('#ffb6c1')
  .addField('Added Active role to:', (array.length == 0) ? 'None' : run.added.join(', '))
  .addField('Removed active role from:', (array.length == 0) ? 'None' : run.removed.join(', '));
  await message.channel.send(feedbackEmbed);
};

exports.help = {
  name: 'activeplebs',
  usage: 'activeplebs',
  description: 'Update active plebs list'
};
