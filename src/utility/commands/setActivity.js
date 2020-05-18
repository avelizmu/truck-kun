const config = require('../../config').discord;

module.exports = {
    name: 'setactivity',
    aliases: [
        'set-activity',
        'set_activity',
        'sa'
    ],
    shortDescription: 'Set the bot\'s activity.',
    description: 'Set the bot\'s activity.\n\n' +
        `► ${config.prefix} setActivity {activity_type} {status} - Set the activity to "{activity_type} {status}". ` +
        'The {activity_type} must be one of playing, watching, streaming, or listening.',
    execute: async function (client, message, arguments) {
        if (arguments.length < 2) {
            return message.reply('Invalid arguments.');
        }
        if (!['playing', 'watching', 'streaming', 'listening'].includes(arguments[0].toLowerCase())) {
            return message.reply('The activity type must be one of playing, watching, streaming, or listening.');
        }

        await client.user.setActivity(arguments.slice(1).join(' '), {
            type: arguments[0].toUpperCase()
        });
    }
}