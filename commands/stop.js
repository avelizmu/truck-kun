const config = require('../config');
const util = require('util');

module.exports = {
    name: 'stop',
    aliases: [
        'st'
    ],
    shortDescription: 'Stop the current song',
    description: 'Stop the current song.\n\n' +
        `► ${config.prefix} stop.`,
    execute: async function (client, message, arguments) {
        if (arguments.length > 0) {
            return message.reply('Invalid argument.');
        }

        await (await message.guild.members.fetch(client.user.id)).voice.connection.dispatcher.end();
    }
}