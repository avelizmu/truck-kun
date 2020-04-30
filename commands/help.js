const {MessageEmbed} = require('discord.js');
const config = require('../config').discord;

module.exports = {
    name: 'help',
    aliases: [
        'h'
    ],
    shortDescription: 'Provide help with the commands',
    description: 'Provide help with the commands.\n\n' +
        `► ${config.prefix} help - Prints the list of commands with a short description.\n\n` +
        `► ${config.prefix} help {command} - Prints the help for a specific command`,
    execute: async function (client, message, arguments) {
        if (arguments.length > 1) {
            return message.reply('Invalid arguments.');
        }

        if (arguments.length === 0) {
            let embed = new MessageEmbed();

            const used = [];
            client.commands.array().forEach(command => {
                if (!used.includes(command.name)) {
                    used.push(command.name);
                    embed = embed.addField(`► ${command.name}`, `\u1160 ${command.shortDescription}`, false);
                }
            });
            return message.channel.send(embed);
        }

        const command = client.commands.get(arguments[0]);
        if (!command) {
            return message.reply(`No command ${command}`);
        }

        let embed = new MessageEmbed();

        embed.setTitle(command.name);
        embed.addField('Aliases', command.aliases.join(' | '), false)
        embed.addField('Description', command.description);

        return message.channel.send(embed);
    }
}