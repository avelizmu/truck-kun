const config = require('../config');
const util = require('util');
const ytdl = require('ytdl-core');

const Youtube = require('youtube-api');
Youtube.authenticate({
    type: "key",
    key: config.youtube.apiKey
});

module.exports = {
    name: 'play',
    aliases: [
        'pl'
    ],
    shortDescription: 'Delete messages',
    description: 'Delete messages.\n\n' +
        `► ${config.prefix} play {youtube url} - Play a youtube video.\n\n` +
        `► ${config.prefix} play {search} - Play the first result of a youtube search.\n\n`,
    execute: async function (client, message, arguments) {
        if (arguments.length < 1) {
            return message.reply('Invalid argument.');
        }

        let url;
        if (arguments[0].match(/https:\/\/(www\.)?youtube\.com\/watch\?v=\w+/)) {
            url = arguments[0]
        } else {
            const result = await util.promisify(Youtube.search.list)({
                part: 'snippet',
                maxResults: 5,
                q: arguments.join(' ')
            });
            url = `https://www.youtube.com/watch?v=${result.items[0].id.videoId}`;
        }

        const channel = message.member.voice.channel;
        if (!channel) {
            return message.reply('You are not in a voice channel.');
        }

        console.log(url);

        const connection = await channel.join();

        const dispatcher = connection.play(ytdl(url));
    }
}