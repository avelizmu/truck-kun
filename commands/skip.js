const config = require('../config');
const mediaHandler = require('../src/mediaHandler');

module.exports = {
    name: 'skip',
    aliases: [
        'sk'
    ],
    shortDescription: 'Skip the current song',
    description: 'Skip the current song.\n\n' +
        `► ${config.prefix} skip.`,
    execute: async function (client, message, arguments) {
        if (arguments.length > 0) {
            return message.reply('Invalid argument.');
        }

        const member = await message.guild.members.fetch(client.user.id);
        const connection = member.voice.connection;
        if (!connection) {
            return message.reply(`Not connected to any channels.`)
        }
        mediaHandler.skip(connection);
    }
}