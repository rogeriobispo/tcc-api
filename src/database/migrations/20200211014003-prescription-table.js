module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('prescriptions', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            medicine_id: {
                type: Sequelize.INTEGER,
                references: { model: 'medicines', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            appointment_id: {
                type: Sequelize.INTEGER,
                references: { model: 'appointments', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('prescriptions');
    },
};
