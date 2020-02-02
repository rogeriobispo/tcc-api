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
            include: [
                {
                    model: User,
                    as: 'provider',
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
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body)))
            return res.status(422).json({ error: 'Validation Fails' });
        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider)
            return res
                .status(422)
                .json({ error: 'only can schedule with providers' });

        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date()))
            return res
                .status(422)
                .json({ error: 'Past dates are not permitted' });
        if (provider_id === req.userId)
            return res
                .status(422)
                .json({ error: 'provider must be diferente from user' });
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability)
            return res
                .status(422)
                .json({ error: 'Appointment date is not available' });

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
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
            user: provider_id,
        });
        return res.json({ appointment });
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
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
