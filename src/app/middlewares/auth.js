import JWT from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

const ErrorMessage = 'Invalid Token';

export default async (req, res, next) => {
    const [, token] = req.headers.authorization.split(' ');
    if (!token) res.status(401).json({ error: ErrorMessage });
    try {
        const decoded = await promisify(JWT.verify)(token, authConfig.secret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: ErrorMessage });
    }
};
