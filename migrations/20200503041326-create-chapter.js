'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Chapters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            subscriptionId: {
                allowNull: false,
                type: Sequelize.INTEGER.UNSIGNED
            },
            identifier: {
                allowNull: true,
                type: Sequelize.STRING
            },
            chapter: {
                allowNull: false,
                type: Sequelize.STRING
            },
            url: {
                allowNull: false,
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('Chapters');
    }
};