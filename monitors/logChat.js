const { Monitor } = require("klasa");
const log = require("../logger");

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
    log.info(
      {
        id: message.id,
        message: message
      },
      "Message Received"
    );
  }
};
