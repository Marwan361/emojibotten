const config = require("./config");
const { Client } = require("klasa");

new Client({
  fetchAllMembers: false,
  prefix: config.prefix,
  readyMessage: client =>
    `Successfully initialized. Logged in as ${client.user.username} for ${
      client.guilds.size
    } guilds and ${client.users.size} users.`
}).login(config.token);
