'use strict';
module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        mangadex: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        rss: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        image: {
            allowNull: true,
            type: DataTypes.STRING
        },
        chapterList: {
            allowNull: true,
            type: DataTypes.STRING
        },
        chapterNumber: {
            allowNull: true,
            type: DataTypes.STRING
        },
        chapterLink: {
            allowNull: true,
            type: DataTypes.STRING
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        url: {
            allowNull: false,
            type: DataTypes.STRING
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
    return Subscription;
};