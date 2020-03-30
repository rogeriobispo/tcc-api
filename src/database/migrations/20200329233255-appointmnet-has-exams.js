module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('appointments', 'exam', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('appointments', 'exam');
    },
};
