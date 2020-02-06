import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schema/NotificationSchema';
import Queue from '../../lib/Queue';
import CancellatioMail from '../jobs/CancellationMail';

class AppointmentController {
    async index(req, res) {
        const { page = 1, size = 20 } = req.query;
        const appointments = await Appointment.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            limit: size,
            offset: (page - 1) * size,
            order: ['date'],
            attributes: ['id', 'date', 'past', 'cancelable'],
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url'],
                        },
                    ],
                },
            ],
        });
        return res.json(appointments);
    }

    async store(req, res) {
        const { doctor_id, date } = req.body;

        const isDoctor = await User.findOne({
            where: { id: doctor_id, doctor: true },
        });

        if (!isDoctor)
            return res
                .status(422)
                .json({ error: 'Somente pode-se agendar com médicos' });

        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date()))
            return res
                .status(422)
                .json({ error: 'Agendamento nos passado não é permitido' });
        if (doctor_id === req.userId)
            return res.status(422).json({
                error: 'Doutor deve ser diferente do usuario que agenda',
            });
        const checkAvailability = await Appointment.findOne({
            where: {
                doctor_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability)
            return res
                .status(422)
                .json({ error: 'A data de agendamento não esta disponivel' });

        const appointment = await Appointment.create({
            user_id: req.userId,
            doctor_id,
            date: hourStart,
        });

        const user = await User.findByPk(req.userId);
        const formatedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formatedDate}`,
            user: doctor_id,
        });
        return res.json({ appointment });
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });

        if (appointment.user_id !== req.userId)
            return res.status(422).json({
                erro: "You don't have permission to cancel this appointment",
            });

        const datewithSub = subHours(appointment.date, 2);

        if (isBefore(datewithSub, new Date()))
            return res.status(422).json({
                erro: 'You can only cancel appointment 2 hours in advance',
            });

        appointment.canceled_at = new Date();
        await appointment.save();
        await Queue.add(CancellatioMail.key, { appointment });
        return res.json(appointment);
    }
}

export default new AppointmentController();
