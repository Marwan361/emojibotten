const config = require("./config");
const { Client } = require("klasa");

new Client({
  fetchAllMembers: false,
  prefix: config.prefix,
  readyMessage: client =>
    `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`
}).login(config.token);
