const {Client, Collection} = require('discord.js');
const client = new Client();
const config = require('../config').discord
const fs = require('fs');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.commands = new Collection();
    const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map(x => require(`../commands/${x}`));
    commands.forEach(command => {
        client.commands.set(command.name, command);
        command.aliases.forEach(alias => {
            client.commands.set(alias, command);
        });
    });
});

client.on('message', async message => {
    const {content} = message;
    const words = content.split(/[\s]/g);
    if (words[0].toLowerCase() === config.prefix) {
        if (words.length < 2) {
            return;
        }

        const command = client.commands.get(words[1].toLowerCase());
        if (!command) {
            return message.reply(`No command ${words[1]}`);
        }

        try {
            await command.execute(client, message, words.splice(2));
        } catch (err) {
            console.error(err);
            return message.reply('An unexpected error occurred while executing this command.');
        }
    }
});

client.login(config.token);