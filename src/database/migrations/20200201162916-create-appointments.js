module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('appointments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            patient_id: {
                type: Sequelize.INTEGER,
                references: { model: 'patients', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            doctor_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            description: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            canceled_at: {
                type: Sequelize.DATE,
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
        return queryInterface.dropTable('appointments');
    },
};
