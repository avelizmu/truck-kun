const {Guild, Feed} = require('../models');
const config = require('../config').discord;

module.exports = {
    name: 'createFeed',
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

        const guild = await Guild.findOne({
            where: {
                guild_id: message.guild.id
            }
        });
        if (!guild) {
            return message.reply('This guild has not been initialized yet.');
        }

        const existingFeed = await Feed.findOne({
            where: {
                user_id: message.author.id
            }
        });
        if (existingFeed) {
            return message.reply(`You already have a feed in this guild. ${await client.channels.fetch(existingFeed.channel_id)}`);
        }

        const category = await client.channels.fetch(guild.category_channel_id);
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
            guild_id: guild.guild_id,
            channel_id: channel.id,
            user_id: message.author.id
        });

        return message.reply(`Feed created at ${channel}`);
    }
}