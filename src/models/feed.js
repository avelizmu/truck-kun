'use strict';
module.exports = (sequelize, DataTypes) => {
    const Feed = sequelize.define('Feed', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        guildSettingsId: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        channelId: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        userId: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE(3)
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE(3)
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['guild_id']
            },
            include: {
                all: true
            }
        }
    });
    Feed.associate = function (models) {
        Feed.hasOne(models.GuildSettings, {
            sourceKey: 'guildSettingsId',
            foreignKey: 'id',
            as: 'guildSettings'
        })
    };
    return Feed;
};