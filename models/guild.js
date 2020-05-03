'use strict';
module.exports = (sequelize, DataTypes) => {
    const Guild = sequelize.define('GuildSettings', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        guildId: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        categoryChannelId: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {});
    return Guild;
};