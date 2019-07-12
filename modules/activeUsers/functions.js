require('dotenv').config();
const { Client } = require('discord.js');
const client = new Client();

const functions = {
  manageActiveRole: (action, serverId, memberId, roleId) => {
    const member = client.guilds.get(serverId).members.get(memberId);
    if (action === 'add') {
      if (member.roles.has(roleId)) {
        console.log(`The user: ${member.user.tag}: ${member.user.id} already has the role!`);
        return;
      }
      member.addRole(roleId).then(() => {
        console.log(`Added the role to the user: ${member.user.tag}: ${member.user.id}`);
      }).catch((error) => {
        console.error(error);
      });
    }

    if (action === 'remove') {
      if (!member.roles.has(roleId)) {
        console.log(`The user: ${member.user.tag}: ${member.user.id} already doesn't have the role!`);
        return;
      }
      member.removeRole(roleId).then(() => {
        console.log(`Removed the role from the user ${member.user.tag}: ${member.user.id}`);
      }).catch((error) => {
        console.log(error);
        console.log(`Couldn't remove the role from the user ${member.user.tag}: ${member.user.id}`);
      });
    }
  }
}

client.login(process.env.TOKEN);

module.exports = functions;
