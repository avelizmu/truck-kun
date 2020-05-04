const {Entrance} = require('../models');
const config = require('../config').discord;

module.exports = {
    name: 'setentrance',
    aliases: [
        'set-entrance',
        'set_entrance',
        'se'
    ],
    shortDescription: 'Set your voice chat entry.',
    description: 'Set your voice chat entry.\n\n' +
        `► ${config.prefix} setentrance {youtube_url} {start_time} {play_time} - Set your personal entrance. Play time is in milliseconds.`,
    execute: async function (client, message, arguments) {
        if (arguments.length !== 3) {
            return message.reply('Invalid arguments.');
        }

        if (!arguments[0].startsWith('https://youtu.be/') && !arguments[0].startsWith('https://www.youtu.be/') && !arguments[0].startsWith('https://youtube.com/') && !arguments[0].startsWith('https://www.youtube.com/')) {
            return message.reply('Invalid youtube URL.');
        }

        if (!(arguments[1].match(/^\d{1,2}:\d{1,2}:\d{1,2}\.\d{1,3}$/) || arguments[1].match(/^\d{1,3}ms, \d{1,2}s, \d{1,2}m, \s{1,2}h$/) || arguments[1].match(/^\d+$/))) {
            return message.reply('The start_time must be in the format of `00:00:00.000`, `0ms, 0s, 0m, 0h`, or number of milliseconds.')
        }

        if (!arguments[2].match(/^\d+$/) && parseInt(arguments[2]) < 15000) {
            return message.reply('The play_time must be a number of milliseconds, less than 15000')
        }

        const existingEntrance = await Entrance.findOne({
            where: {
                user: message.author.id
            }
        });
        if (existingEntrance) {
            await existingEntrance.update({
                url: arguments[0],
                start: arguments[1],
                time: arguments[2]
            });

            return message.reply('Set your entrance theme.')
        } else {
            await Entrance.create({
                user: message.author.id,
                url: arguments[0],
                start: arguments[1],
                time: arguments[2]
            });

            return message.reply('Updated your entrance theme.')
        }
    }
}