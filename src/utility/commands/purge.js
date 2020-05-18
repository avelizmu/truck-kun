const config = require('../../config').discord;

module.exports = {
    name: 'purge',
    aliases: [
        'p',
        'delete',
        'del'
    ],
    shortDescription: 'Delete messages',
    description: 'Delete messages.\n\n' +
        `► ${config.prefix} purge {id} - Delete all the messages to (and including) the message with a specific id.\n\n` +
        `► ${config.prefix} purge {url} - Delete all the messages to (and including) the message linked to by the url.\n\n`,
    execute: async function (client, message, arguments) {
        const highestRole = message.member.roles.highest;
        const botMemberRole = await message.guild.members.fetch(client.user.id);
        if (highestRole.comparePositionTo(botMemberRole.roles.highest) < 0) {
            return message.reply('You are not allowed to use this command');
        }
        if (arguments.length > 1) {
            return message.reply('Invalid argument.');
        }
        if (arguments[0].match(/[^\d]/)) {

            const linkMatch = arguments[0].match(/https:\/\/discordapp.com\/channels\/\d+\/\d+\/(\d+)/);
            if (linkMatch && linkMatch[1]) {
                arguments[0] = linkMatch[1]
            } else {
                return message.reply('Invalid argument.')
            }
        }

        const deleteMessages = await message.channel.messages.fetch({
            after: arguments[0]
        });
        if (deleteMessages && deleteMessages.size) {
            await message.channel.bulkDelete(deleteMessages);
            await message.channel.messages.delete(arguments[0]);
        } else {
            return message.reply('No message with that ID');
        }
    }
}