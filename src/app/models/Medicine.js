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
            }
        );
        const options = { field: 'deleted', deleted: 1 };
        sequelizeSoftDelete.softDelete(Medicine, options);
        return this;
    }
}

export default Medicine;
