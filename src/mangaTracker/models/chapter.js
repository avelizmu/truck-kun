'use strict';
module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define('Chapter', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        subscriptionId: {
            allowNull: false,
            type: DataTypes.INTEGER.UNSIGNED
        },
        identifier: {
            allowNull: true,
            type: DataTypes.STRING
        },
        chapter: {
            allowNull: false,
            type: DataTypes.STRING
        },
        url: {
            allowNull: false,
            type: DataTypes.STRING,
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
                exclude: ['subscriptionId']
            },
            include: {
                all: true,
                nested: true
            }
        }
    });
    Chapter.associate = function (models) {
        Chapter.hasOne(models.Subscription, {
            sourceKey: 'subscriptionId',
            foreignKey: 'id',
            as: 'subscription'
        })
    };
    return Chapter;
};