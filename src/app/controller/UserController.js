import Specialty from '../models/Specialty';
import User from '../models/User';
import File from '../models/File';

class UserController {
    async show(req, res) {
        const user = await User.findByPk(req.params.id, {
            attributes: [
                'id',
                'name',
                'email',
                'doctor',
                'crm',
                'roles',
                'specialty_id',
            ],
        });
        if (user) res.status(200).json(user);

        res.status(404);
    }

    async index(_, res) {
        const user = await User.findAll({
            attributes: [
                'id',
                'name',
                'email',
                'roles',
                'doctor',
                'crm',
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
        try {
            const { doctor, specialty_id } = req.body;

            const especialty = await Specialty.findByPk(specialty_id);
            if (!doctor) req.body.specialty_id = null;

            if (doctor && !especialty)
                return res
                    .status(422)
                    .json({ errors: 'Esta especialidade não existe' });

            const userExists = await User.findOne({
                where: { email: req.body.email },
            });
            if (userExists)
                return res.status(400).json({ errors: 'Email já utilizado' });
            const user = await User.create(req.body);
            const { id, name, email, provider } = user;
            return res.json({
                id,
                name,
                email,
                provider,
            });
        } catch (error) {
            return res.status(422).json({ errors: 'Erro no banco de dados' });
        }
    }

    async update(req, res) {
        const { email } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ errors: 'Usuario não localizado' });

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists)
                return res.status(422).json({ errors: 'User already exists' });
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
