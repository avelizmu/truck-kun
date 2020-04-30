'use strict';
module.exports = (sequelize, DataTypes) => {
    const Feed = sequelize.define('Feed', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        guild_id: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        channel_id: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        user_id: {
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
        Feed.hasOne(models.Guild, {
            sourceKey: 'guild_id',
            foreignKey: 'id',
            as: 'guild'
        })
    };
    return Feed;
};