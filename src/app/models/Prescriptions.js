import Sequelize, { Model } from 'sequelize';

class Prescription extends Model {
    static init(sequelize) {
        super.init(
            {
                // medicine_id: Sequelize.INTEGER,
                // appointment_id: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Medicine, {
            foreignKey: 'medicine_id',
            as: 'medicine',
        });
        this.belongsTo(models.Appointment, {
            foreignKey: 'appointment_id',
            as: 'appointment',
        });
    }
}

export default Prescription;
