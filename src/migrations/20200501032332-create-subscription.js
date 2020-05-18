'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Subscriptions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            mangadex: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            rss: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            image: {
                allowNull: true,
                type: Sequelize.STRING
            },
            chapterList: {
                allowNull: true,
                type: Sequelize.STRING
            },
            chapterNumber: {
                allowNull: true,
                type: Sequelize.STRING
            },
            chapterLink: {
                allowNull: true,
                type: Sequelize.STRING
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE(3)
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE(3)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Subscriptions');
    }
};