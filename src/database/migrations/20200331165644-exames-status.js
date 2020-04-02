module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('exams', 'finished', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('exams', 'finished');
    },
};
