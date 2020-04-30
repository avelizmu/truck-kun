'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Feeds', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            guild_id: {
                allowNull: false,
                type: Sequelize.BIGINT.UNSIGNED
            },
            channel_id: {
                allowNull: false,
                type: Sequelize.BIGINT.UNSIGNED
            },
            user_id: {
                allowNull: false,
                type: Sequelize.BIGINT.UNSIGNED
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
        return queryInterface.dropTable('Feeds');
    }
};