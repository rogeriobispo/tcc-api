import Sequelize, { Model } from 'sequelize';

class Medicine extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                factory: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Medicine;
