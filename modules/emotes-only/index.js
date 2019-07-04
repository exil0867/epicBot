require('dotenv').config();

exports.run = async (client, message) => {
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
};
