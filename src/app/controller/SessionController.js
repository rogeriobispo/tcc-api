import jwt from 'jsonwebtoken';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({
            include: {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
            },
            where: { email },
        });
        if (!user)
            return res.status(401).json({ error: 'Wrong User/Password' });

        if (!(await user.checkPassword(password)))
            return res.status(401).json({ error: 'Wrong User/Password' });
        return res.json({
            user,
            token: jwt.sign({ user }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
