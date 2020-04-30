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
    }, {});
    return Feed;
};