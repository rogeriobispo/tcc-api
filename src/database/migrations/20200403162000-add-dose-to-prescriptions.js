module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('prescriptions', 'dose', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('prescriptions', 'dose');
    },
};
