import Sequelize, { Model } from 'sequelize';

class Exam extends Model {
    static init(sequelize) {
        super.init(
            {
                patient_id: Sequelize.INTEGER,
                appointment_id: Sequelize.INTEGER,
                name: Sequelize.STRING,
                with_doctor: Sequelize.BOOLEAN,
                with_patient: Sequelize.BOOLEAN,
                results: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
        this.belongsTo(models.Appointment, {
            foreignKey: 'appointment_id',
            as: 'appointment',
        });
    }
}

export default Exam;
