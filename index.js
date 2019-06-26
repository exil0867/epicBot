require('dotenv').config();
const fs = require('fs');
const { Client } = require('discord.js');
const client = new Client();
const commandsMap = new Map();
const table = require('./modules/activeUsers/table');
const interval = require('./modules/activeUsers/interval');
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX
};

module.exports = config;

client.config = config;

client.commands = commandsMap;

fs.readdirSync('./commands/')
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    console.log(`Loading command ${file}`);
    try {
      let command = require(`./commands/${file}`);
      if (typeof command.run !== 'function') {
        throw 'Command is missing the run function!';
      } else if (!command.help || !command.help.name) {
        throw 'Command is missing a valid help object!';
      }
      commandsMap.set(command.help.name, command);
    } catch (error) {
      console.error(`Couldn't load command ${f}: ${error}`);
    }
  });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})!`);
  client.generateInvite([
    'ADMINISTRATOR',
  ]).then(invite => {
    console.log(`Generated invite link:\n${invite}`);
  });
  // table.sync();
  // setInterval(function() {
  // let run = interval.run();
  // let result = {
  //   added: run.added.join(', '),
  //   removed: run.removed.join(', ')
  // }
  // client.channels.get(process.env.INTERVAL_LOG_CHANNEL).send(`Added Active role to: ${result.added}\nRemoved active role from: ${result.removed}`);
  // }, process.env.RUN_INTERVAL_EVERY);
});

client.on('message', message => {
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
  if (commandsMap.get(label)) {
    commandsMap.get(label).run(client, message, args);
  }

});

client.on('message', message => {
  if (!message.guild) {
    return;
  }
  if (message.channel.id == process.env.EMOTES_ONLY_CHANNEL) {
    if (message.author.id == client.user.id) {
      return;
    }
    if (message.author.bot) {
      message.delete();
      return;
    }
    const text = message.content.replace(/:[^:\s]+:|<:[^:\s]+:[0-9]+>|<a:[^:\s]+:[0-9]+>/g, '').replace(/\s+/g, '');
    if (text) {
      message.delete();
      message.channel.send(`<@${message.member.user.id}> Your message has been deleted! This channel is in emotes-only mode. <:peeshifar:537055607144841216>`).then((botMessage) => {
        botMessage.delete(5000);
      }).catch(error => {
        console.log(error);
      });
    }
  }
});

// client.on('message', message => {
//   if (message.author.bot || !message.guild) {
//     return;
//   }
//   let { content } = message;
//   let split = content.substr(config.prefix.length).split(' ');
//   let label = split[0];
//   let args = split.slice(1);
//   require('./modules/activeUsers/listen').listen(client, message, args);
// });

client.login(config.token);
