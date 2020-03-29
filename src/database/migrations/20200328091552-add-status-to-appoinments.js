module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('appointments', 'status', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('appointments', 'status');
    },
};
