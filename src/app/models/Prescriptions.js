import Sequelize, { Model } from 'sequelize';

class Prescription extends Model {
    static init(sequelize) {
        super.init(
            {
                medicine_id: Sequelize.INTEGER,
                appointment_id: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Prescription;
