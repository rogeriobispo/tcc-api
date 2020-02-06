import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class SchedulerController {
    async index(req, res) {
        const { page = 1, size = 20 } = req.query;

        const checkUserProvider = await User.findOne({
            where: { id: req.userId, doctor: true },
        });

        if (!checkUserProvider)
            return res.status(422).json({ error: 'Usuário não é um médico' });

        const { date } = req.query;
        const parsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            },
            limit: size,
            offset: (page - 1) * size,
            order: ['date'],
        });

        return res.json({ appointments });
    }
}

export default new SchedulerController();
