import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
    static init(sequelize) {
        super.init(
            {
                day: Sequelize.INTEGER,
                schedule_time: Sequelize.STRING,
                doctor_id: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Schedule;
