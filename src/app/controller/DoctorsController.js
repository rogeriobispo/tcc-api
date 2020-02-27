import User from '../models/User';
import File from '../models/File';

class DoctorsController {
    async index(_, res) {
        const doctor = await User.findAll({
            where: { doctor: true },
            attributes: ['id', 'name', 'email'],
            include: {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
            },
        });
        res.json(doctor);
    }
}

export default new DoctorsController();
