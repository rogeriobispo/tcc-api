import User from '../models/User';

class UserController {
    async store(req, res) {
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });
        if (userExists)
            return res.status(400).json({ error: 'user already exists' });
        const user = await User.create(req.body);
        const { id, nome, email, provider } = user;
        return res.json({
            id,
            nome,
            email,
            provider,
        });
    }
}

export default new UserController();
