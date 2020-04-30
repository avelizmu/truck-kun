'use strict';
module.exports = (sequelize, DataTypes) => {
    const Guild = sequelize.define('Guild', {
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
        category_channel_id: {
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