module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('exams', 'appointment_id', {
            type: Sequelize.INTEGER,
            references: { model: 'appointments', key: 'id' },
            onDelete: 'SET NULL',
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('exams', 'appointment_id');
    },
};
