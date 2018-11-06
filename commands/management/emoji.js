const config = require("../../config");
const { Command } = require("klasa");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: "Add an emoji via a URL",
      usage: "<url:url> <name:str{1,20}>",
      usageDelim: " ",
      aliases: ["addEmoji", "add"]
    });
  }

  async run(message, [url, name]) {
    console.log(url, name);
    if (message.member.hasPermission("MANAGE_EMOJIS")) {
      message.guild.emojis
        .create(url, name)
        .then(emoji => {
          message.channel.send(`Successfully uploaded **${name}** ${emoji}.`);
        })
        .catch(e => {
          message.channel.send(`Unable to create emoji for reason: ${e}`);
        });
    } else {
      message.channel.send(
        "You do not have the Manage Emojis permission in this server."
      );
    }
  }

  async init() {
    /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
  }
};
