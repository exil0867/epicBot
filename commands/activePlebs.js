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
  // Note: BLACKLISTED_ROLE is basically the mods role so i should add a seperate env variable for the following check
  if (!message.member.roles.find(r => r.id == process.env.BLACKLISTED_ROLE)){
    message.channel.send(`<@${message.member.user.id}> Hehe you are not a mod <:peeshifar:537055607144841216>`);
    return;
  }
  let run = await interval.run();
  let feedbackEmbed = new RichEmbed()
  .setColor('#ffb6c1')
  .addField('Added Active role to:', (run.added.length == 0) ? 'None' : run.added.join(', '))
  .addField('Removed active role from:', (run.removed.length == 0) ? 'None' : run.removed.join(', '));
  await message.channel.send(feedbackEmbed);
};

exports.help = {
  name: 'activeplebs',
  usage: 'activeplebs',
  description: 'Update active plebs list'
};
