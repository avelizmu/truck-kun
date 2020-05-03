'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable('Guilds', 'GuildSettings');
        await queryInterface.renameColumn('GuildSettings', 'guild_id', 'guildId')
        await queryInterface.renameColumn('GuildSettings', 'category_channel_id', 'categoryChannelId')
        await queryInterface.renameColumn('Feeds', 'guild_id', 'guildSettingsId')
        await queryInterface.renameColumn('Feeds', 'channel_id', 'channelId')
        await queryInterface.renameColumn('Feeds', 'user_id', 'userId')
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable('GuildSettings', 'Guilds');
        await queryInterface.renameColumn('Guilds', 'guildId', 'guild_id')
        await queryInterface.renameColumn('Guilds', 'categoryChannelId', 'category_channel_id')
        await queryInterface.renameColumn('Feeds', 'guildSettingsId', 'guild_id')
        await queryInterface.renameColumn('Feeds', 'channelId', 'channel_id')
        await queryInterface.renameColumn('Feeds', 'userId', 'user_id')
    }
};
