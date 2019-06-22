const functions = {
  manageActiveRole: (action, serverId, memberId, roleId) => {
    const member = client.guilds.get(serverId).members.get(memberId);
    if (action === 'add') {
      if (!member.roles.has(roleId)) {
        member.addRole(roleId).then(() => {
          console.log('Added the role to the user');
        }).catch((error) => {
          console.error(error);
        });
      } else {
        console.log('The user already has the role!');
      }
    }
    if (action === 'remove') {
      if (member.roles.has(roleId)) {
        member.removeRole(roleId).then(() => {
          console.log('Removed the role from the user!');
        }).catch((error) => {
          console.log(error);
          console.log(`Couldn't remove the role from the user!`);
        });
      } else {
        console.log(`The user already doesn't have the role!`);
      }
    }
  }
}

module.exports = functions;
