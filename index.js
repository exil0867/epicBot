require('dotenv').config();
require('http').createServer().listen(3000)
const fs = require('fs');
const { Client } = require('discord.js');
const client = new Client();
const commandsMap = new Map();
const interval = require('./modules/activeUsers/interval');
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX
};

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
  table.sync();
  setInterval(function() {
    interval.run()
  }, process.env.RUN_INTERVAL_EVERY);

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
  if (message.author.bot || !message.guild) {
    return;
  }
  let { content } = message;
  let split = content.substr(config.prefix.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  require('./modules/activeUsers/listen').listen(client, message, args);
});

client.login(config.token);
