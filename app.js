const config = require("./config");
const { Client } = require("klasa");

new Client({
  fetchAllMembers: false,
  prefix: config.prefix,
  commandEditing: true,
  commandLogging: true,
  readyMessage: client =>
    `Successfully initialized. Ready to serve ${
      client.guilds.size
    } guilds. Prefix is ${client}`
}).login(config.token);
