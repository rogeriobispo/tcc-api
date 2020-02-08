import Sequelize, { Model } from 'sequelize';

class Specialty extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}
export default Specialty;
