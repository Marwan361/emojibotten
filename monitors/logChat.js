const { Monitor } = require("klasa");

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      name: "logChat",
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: true,
      ignoreBlacklistedUsers: true,
      ignoreBlacklistedGuilds: true
    });
  }

  async run(message) {
    console.log(`
    Guild ID: ${message.guild.id}\n
    Guild: ${message.guild.name}\n
    Channel: ${message.channel.name}\n
    Author: ${message.author.username}#${message.author.discriminator}\n
    Content: ${message.content}
    `);
  }
};
