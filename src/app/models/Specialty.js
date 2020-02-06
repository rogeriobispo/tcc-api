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

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'specialty_id',
            as: 'specialty',
        });
    }
}
export default Specialty;
