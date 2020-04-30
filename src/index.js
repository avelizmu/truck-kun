const {Client} = require('discord.js');
const client = new Client();
const config = require('../config').discord

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);