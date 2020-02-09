import Sequelize, { Model } from 'sequelize';

class Patient extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                document: Sequelize.STRING,
                email: Sequelize.STRING,
                age: Sequelize.STRING,
                cel: Sequelize.STRING,
                phone: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    }
}

export default Patient;
