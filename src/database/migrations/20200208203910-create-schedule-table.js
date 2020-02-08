module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('schedule', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            doctor_id: {
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            day: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            start_schedule: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            end_schedule: {
                type: Sequelize.STRING,
                allowNull: false,
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
        return queryInterface.dropTable('schedule');
    },
};
