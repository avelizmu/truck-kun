const config = require('../config');
const mediaHandler = require('../mediaHandler');

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

        const member = await message.guild.members.fetch(client.user.id);
        const connection = member.voice.connection;
        if (!connection) {
            return message.reply(`Not connected to any channels.`)
        }
        mediaHandler.stop(connection);
    }
}