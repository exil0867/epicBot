require('dotenv').config();

exports.run = async (client, message) => {
  if (!message.guild) {
    return;
  }
  if (message.channel.id == process.env.EMOTES_ONLY_CHANNEL) {
    if (!((message.content.startsWith('<a:') || message.content.startsWith('<:')) && message.content.endsWith('>'))) {
      message.delete();
      message.channel.send('Your message has been deleted! This channel is in emotes-only mode. <:peeshifar:537055607144841216>').then((botMessage) => {
        botMessage.delete(5000);
      }).catch(error => {
        console.log(error);
      });
    }
  }
};
