'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('Subscriptions', 'chapterList', {
            allowNull: true,
            type: Sequelize.STRING(1024)
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('Subscriptions', 'chapterList', {
            allowNull: true,
            type: Sequelize.STRING(255)
        });
    }
};
