module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('appointments', 'type', {
            type: Sequelize.STRING,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('appointments', 'status');
    },
};
