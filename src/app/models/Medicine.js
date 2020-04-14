import Sequelize, { Model } from 'sequelize';
import sequelizeSoftDelete from 'sequelize-soft-delete';

class Medicine extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                factory: Sequelize.STRING,
                deleted: {
                    type: Sequelize.INTEGER(1),
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                defaultScope: {
                    where: {
                        deleted: 0,
                    },
                },
            }
        );
        const options = { field: 'deleted', deleted: 1 };
        sequelizeSoftDelete.softDelete(Medicine, options);
        return this;
    }

    static associate(models) {
        this.belongsToMany(models.Appointment, {
            through: 'prescriptions',
            foreignKey: 'appointment_id',
            as: 'medicines',
        });
    }
}

export default Medicine;
