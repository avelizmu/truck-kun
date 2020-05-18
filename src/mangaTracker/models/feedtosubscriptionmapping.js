'use strict';
module.exports = (sequelize, DataTypes) => {
    const FeedToSubscriptionMapping = sequelize.define('FeedToSubscriptionMapping', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        feedId: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        subscriptionId: {
            type: DataTypes.INTEGER.UNSIGNED
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
                exclude: ['feedId', 'subscriptionId']
            },
            include: {
                all: true,
                nested: true
            }
        },
        scopes: {
            withFeed: {
                attributes: {
                    exclude: 'feedId'
                },
                include: {
                    all: true,
                    nested: true
                }
            },
            withSubscription: {
                attributes: {
                    exclude: 'feedId'
                },
                include: {
                    all: true,
                    nested: true
                }
            }
        }
    });
    FeedToSubscriptionMapping.associate = function (models) {
        FeedToSubscriptionMapping.hasOne(models.Feed, {
            sourceKey: 'feedId',
            foreignKey: 'id',
            as: 'feed'
        });
        FeedToSubscriptionMapping.hasOne(models.Subscription, {
            sourceKey: 'subscriptionId',
            foreignKey: 'id',
            as: 'subscription'
        });
    };
    return FeedToSubscriptionMapping;
};