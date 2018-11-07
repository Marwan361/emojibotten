const config = require("../../config");
const { Command } = require("klasa");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives the bot invite",
      aliases: ["inv", "link", "url"],
      enabled: true
    });
  }

  async run(message, [...params]) {
    message.send(config.inv);
  }

  async init() {
    /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
  }
};
