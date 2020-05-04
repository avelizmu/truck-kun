'use strict';
module.exports = (sequelize, DataTypes) => {
    const Entrance = sequelize.define('Entrance', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        url: {
            allowNull: false,
            type: DataTypes.STRING
        },
        start: {
            allowNull: false,
            type: DataTypes.STRING
        },
        time: {
            allowNull: false,
            type: DataTypes.INTEGER.UNSIGNED
        },
        lastUsed: {
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED,
            defaultValue: 0
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
    return Entrance;
};