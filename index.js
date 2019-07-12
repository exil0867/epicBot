require('dotenv').config();
const fs = require('fs');
const glob = require('glob');
const { Client } = require('discord.js');
const client = new Client();
const commandsMap = new Map();
const modulesMap = new Set();
const table = require('./modules/activeUsers/table');
const interval = require('./modules/activeUsers/interval');
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX
};

module.exports = config;

client.config = config;

client.commands = commandsMap;

client.modules = modulesMap;

glob('./commands/*.js', (error, files) => {
  if (error) {
    console.log(error);
    return;
  }
  files.forEach(file => {
    console.log(`Loading command ${file}`);
    try {
      let command = require(file);
      if (typeof command.run !== 'function') {
        throw 'Command is missing the run function!';
      } else if (!command.help || !command.help.name) {
        throw 'Command is missing a valid help object!';
      }
      commandsMap.set(command.help.name, command);
    } catch (error) {
      console.error(`Couldn't load command ${file}: ${error}`);
    }
  });
});

glob('./modules/*/index.js', (error, files) => {
  if (error) {
    console.log(error);
    return;
  }
  files.forEach(file => {
    console.log(`Loading module ${file}`);
    try {
      let module = require(file);
      if (typeof module.run !== 'function') {
        throw 'Module is missing the run function!';
      }
      modulesMap.add(module);
    } catch (error) {
      console.error(`Couldn't load module ${file}: ${error}`);
    }
  });
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} (ID: ${client.user.id})!`);
  client.generateInvite([
    'ADMINISTRATOR',
  ]).then(invite => {
    console.log(`Generated invite link:\n${invite}`);
  });
  table.sync();
  setInterval(async function() {
    let run = await interval.run();
    let feedbackEmbed = new RichEmbed()
      .setColor('#ffb6c1')
      .addField('Added Active role to:', (run.added.length == 0) ? 'None' : run.added.join(', '))
      .addField('Removed active role from:', (run.removed.length == 0) ? 'None' : run.removed.join(', '));
    client.channels.get(process.env.INTERVAL_LOG_CHANNEL).send(feedbackEmbed);
  }, process.env.RUN_INTERVAL_EVERY);

});

client.on('message', message => {
  modulesMap.forEach((module) => {
    module.run(client, message)
  })
  let split = message.content.substr(config.prefix.length).split(' ');
  let label = split[0];
  if (commandsMap.get(label)) {
    commandsMap.get(label).run(client, message);
  }
});

client.login(config.token);
