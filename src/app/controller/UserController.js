import Specialty from '../models/Specialty';
import User from '../models/User';
import File from '../models/File';

class UserController {
    async index(_, res) {
        const user = await User.findAll({
            attributes: [
                'id',
                'name',
                'email',
                'roles',
                'created_at',
                'updated_at',
            ],
            include: {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
            },
        });
        res.json(user);
    }

    async store(req, res) {
        const { doctor, specialtyId } = req.body;
        const especialty = await Specialty.findByPk(specialtyId);
        if (doctor && specialtyId !== 0 && !especialty)
            return res
                .status(422)
                .json({ error: 'Esta especialidade não existe' });

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (userExists)
            return res.status(400).json({ error: 'Email já utilizado' });
        const user = await User.create(req.body);
        const { id, name, email, provider } = user;
        return res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async update(req, res) {
        const { email } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: 'Usuario não localizado' });

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists)
                return res.status(422).json({ error: 'User already exists' });
        }
        const { id, name, doctor } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
            doctor,
        });
    }
}

export default new UserController();
