import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class DoctorApointmentController {
    async index(req, res) {
        const { page = 1, size = 20 } = req.query;

        const checkUserDoctor = await User.findOne({
            where: { id: req.params.id, doctor: true },
        });

        if (!checkUserDoctor)
            return res.status(422).json({ error: 'Médico não encontrado' });

        const { date } = req.query;
        const parsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                doctor_id: req.params.id,
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

        return res.json(appointments);
    }
}

export default new DoctorApointmentController();
