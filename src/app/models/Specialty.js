import Sequelize, { Model } from 'sequelize';
import sequelizeSoftDelete from 'sequelize-soft-delete';

class Specialty extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
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
        sequelizeSoftDelete.softDelete(Specialty, options);
        return this;
    }
}
export default Specialty;
