const config = require('../config');
const util = require('util');
const mediaHandler = require('../src/mediaHandler');

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
    shortDescription: 'Play a song.',
    description: 'Play a song.\n\n' +
        `► ${config.prefix} play {youtube url} {start second} - Play a youtube video.\n\n` +
        `► ${config.prefix} play {search} - Play the first result of a youtube search.\n\n`,
    execute: async function (client, message, arguments) {
        if (arguments.length < 1) {
            return message.reply('Invalid argument.');
        }

        let url;
        let startTime = 0;
        if (arguments[0].match(/https:\/\/(www\.)?youtube\.com\/watch\?v=\w+/) || arguments[0].match(/https:\/\/(www\.)?youtu\.be\/\w+/)) {
            url = arguments[0];
            startTime = arguments[1] || 0;
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

        const connection = await channel.join();

        message.reply(mediaHandler.play(connection, {url, seek: startTime}));
    }
}