const {GuildSettings, Feed} = require('../models');
const config = require('../config').discord;

module.exports = {
    name: 'createfeed',
    aliases: [
        'create-feed',
        'create_feed',
        'cf'
    ],
    shortDescription: 'Create a feed.',
    description: 'Create a feed.\n\n' +
        `► ${config.prefix} createFeed - Create your subscription feed to start getting updates.`,
    execute: async function (client, message, arguments) {
        if (arguments.length !== 0) {
            return message.reply('Invalid arguments.');
        }

        const guildSettings = await GuildSettings.findOne({
            where: {
                guildId: message.guild.id
            }
        });
        if (!guildSettings) {
            return message.reply('This guild has not been initialized yet.');
        }

        const existingFeed = await Feed.findOne({
            where: {
                userId: message.author.id,
                guildSettingsId: guildSettings.id
            }
        });
        if (existingFeed) {
            return message.reply(`You already have a feed in this guild. ${await client.channels.fetch(existingFeed.channelId)}`);
        }

        const category = await client.channels.fetch(guildSettings.categoryChannelId);
        const channel = await message.guild.channels.create(`${message.author.username}-truck-kun-feed`, {
            type: 'text',
            parent: category,
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: message.author,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        });

        await Feed.create({
            guildSettingsId: guildSettings.id,
            channelId: channel.id,
            userId: message.author.id
        });

        return message.reply(`Feed created at ${channel}`);
    }
}