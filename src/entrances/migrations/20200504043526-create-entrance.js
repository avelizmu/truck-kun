'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Entrances', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user: {
                allowNull: false,
                type: Sequelize.BIGINT.UNSIGNED
            },
            url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            start: {
                allowNull: false,
                type: Sequelize.STRING
            },
            time: {
                allowNull: false,
                type: Sequelize.INTEGER.UNSIGNED
            },
            lastUsed: {
                allowNull: false,
                type: Sequelize.BIGINT.UNSIGNED,
                defaultValue: 0
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
        return queryInterface.dropTable('Entrances');
    }
};