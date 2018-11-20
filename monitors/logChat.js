const { Monitor } = require("klasa");
const log = require("../logger");

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      name: "logChat",
      enabled: true,
      ignoreBots: false,
      ignoreSelf: false,
      ignoreOthers: false,
      ignoreWebhooks: false,
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
