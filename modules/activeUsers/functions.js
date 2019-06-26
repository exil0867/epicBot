require('dotenv').config();
const { Client } = require('discord.js');
const client = new Client();

const functions = {
  manageActiveRole: async (action, serverId, memberId, roleId) => {
    let promise = new Promise((resolve, reject) => {
      const member = client.guilds.get(serverId).members.get(memberId);
      if (action === 'add') {
        if (!member.roles.has(roleId)) {
          member.addRole(roleId).then(() => {
            resolve([member.user.tag, member.user.id, 'added the role']);
          }).catch((error) => {
            reject(error);
          });
        } else {
          resolve([member.user.tag, member.user.id, 'already has the role']);
        }
      }
      if (action === 'remove') {
        if (member.roles.has(roleId)) {
          member.removeRole(roleId).then(() => {
            resolve([member.user.tag, member.user.id, 'removed the role']);
          }).catch((error) => {
            reject(error);
          });
        } else {
          resolve([member.user.tag, member.user.id, 'already does not have the role']);
        }
      }
    });
    return await promise;
  }
}

client.login(process.env.TOKEN);

module.exports = functions;
