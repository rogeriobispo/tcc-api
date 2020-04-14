/* eslint-disable no-param-reassign */
import { startOfDay, endOfDay, parseISO, subHours } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Patient from '../models/Patient';

class DoctorApointmentController {
    async index(req, res) {
        const { filter, finished = false, prescription = false } = req.query;
        const checkUserDoctor = await User.findOne({
            where: { id: req.params.id, doctor: true },
        });

        if (!checkUserDoctor)
            return res.status(422).json({ error: 'Médico não encontrado' });
        const { date } = req.query;

        const parsedDate = parseISO(date);

        let filterDate = null;
        if (filter !== 'all') {
            filterDate = {
                doctor_id: req.params.id,
                canceled_at: null,
                finished,
                prescription,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            };
        } else {
            filterDate = {
                doctor_id: req.params.id,
                canceled_at: null,
            };
        }

        if (filter === 'exams') {
            filterDate = {
                doctor_id: req.params.id,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            };
        }
        const appointments = await Appointment.findAll({
            where: filterDate,
            // limit: size,
            // offset: (page - 1) * size,
            order: ['date'],
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'name'],
                },

                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name'],
                },
            ],
        });

        return res.json(appointments);
    }
}

export default new DoctorApointmentController();
