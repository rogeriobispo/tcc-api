import Specialty from '../models/Specialty';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const { doctor, specialty_id } = req.body;
        const especialty = await Specialty.findByPk(specialty_id);
        if (doctor && !especialty)
            return res
                .status(422)
                .json({ error: 'Esta especialidade não existe' });

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (userExists)
            return res.status(400).json({ error: 'user already exists' });
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
        const { email, old_password, confirm_password } = req.body;
        const user = await User.findByPk(req.userId);

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });
            if (userExists)
                return res.status(422).json({ error: 'User already exists' });
        }

        if (confirm_password && !(await user.checkPassword(old_password)))
            return res.status(401).json({ error: 'Invalid Password' });

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
