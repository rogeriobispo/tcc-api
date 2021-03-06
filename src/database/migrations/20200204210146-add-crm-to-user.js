module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'crm', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('users', 'crm');
    },
};
