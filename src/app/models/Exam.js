import Sequelize, { Model } from 'sequelize';

class Exam extends Model {
    static init(sequelize) {
        super.init(
            {
                patient_id: Sequelize.INTEGER,
                appointment_id: Sequelize.INTEGER,
                image_result: Sequelize.INTEGER,
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
        this.belongsTo(models.File, {
            foreignKey: 'image_result',
            as: 'imageResult',
        });
        this.belongsTo(models.Patient, {
            foreignKey: 'patient_id',
            as: 'patient',
        });
        this.belongsTo(models.Appointment, {
            foreignKey: 'appointment_id',
            as: 'appointment',
        });
    }
}

export default Exam;
