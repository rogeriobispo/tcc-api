module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'specialty_id', {
            type: Sequelize.INTEGER,
            references: { model: 'specialties', key: 'id' },
            onUpdate: 'SET NULL',
            onDelete: 'SET NULL',
            allowNull: true,
        });
    },

    down: queryInterface => {
        return queryInterface.removeColumn('users', 'specialty_id');
    },
};
