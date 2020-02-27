import User from '../models/User';
import File from '../models/File';
import Especialty from '../models/Specialty';

class DoctorsController {
    async index(_, res) {
        const doctor = await User.findAll({
            where: { doctor: true },
            attributes: ['id', 'name', 'crm'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path', 'url'],
                },
                {
                    model: Especialty,
                    as: 'specialty',
                    attributes: ['name'],
                },
            ],
        });
        res.json(doctor);
    }
}

export default new DoctorsController();
