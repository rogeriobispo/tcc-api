import User from '../models/User';
import File from '../models/File';

class DoctorsController {
    async index(_req, res) {
        const providers = await User.findAll({
            where: { doctor: true },
            attributes: ['id', 'name', 'email'],
            include: {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
            },
        });
        res.json(providers);
    }
}

export default new DoctorsController();
