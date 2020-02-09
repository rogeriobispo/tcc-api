import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Patient from '../models/Patient';
import Notification from '../schema/NotificationSchema';
import Queue from '../../lib/Queue';
import CancellatioMail from '../jobs/CancellationMail';

class AppointmentController {
    async store(req, res) {
        const { doctor_id, date, patient_id } = req.body;

        const patient = await Patient.findOne({
            where: { id: patient_id },
        });
        if (!patient)
            return res.status(422).json({ error: 'Paciente não localizado' });

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
            patient_id,
            doctor_id,
            date: hourStart,
        });

        const formatedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo agendamento de ${patient.name} para ${formatedDate}`,
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
