import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                doctor: Sequelize.BOOLEAN,
                crm: Sequelize.STRING,
                roles: Sequelize.STRING,
                specialty_id: Sequelize.NUMBER,
            },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
        this.belongsTo(models.File, {
            foreignKey: 'specialty_id',
            as: 'specialty',
        });
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
