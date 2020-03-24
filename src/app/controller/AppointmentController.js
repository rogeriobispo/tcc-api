import {
    getDay,
    startOfHour,
    parseISO,
    isBefore,
    format,
    subHours,
} from 'date-fns';

import pt from 'date-fns/locale/pt-BR';
import File from '../models/File';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Patient from '../models/Patient';
import Notification from '../schema/NotificationSchema';
import Schedule from '../models/Schedule';

class AppointmentController {
    async index(req, res) {
        const { page = 1, size = 20 } = req.query;
        const { id: patient_id } = req.params;

        const appointments = await Appointment.findAll({
            where: {
                patient_id,
                canceled_at: null,
            },
            limit: size,
            offset: (page - 1) * size,
            order: ['date'],
            attributes: ['id', 'date', 'past', 'cancelable'],
            include: [
                {
                    model: Patient,
                    as: 'patient',
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
        const { doctor_id, date, patient_id } = req.body;
        console.log(doctor_id, date, patient_id);
        const patient = await Patient.findOne({
            where: { id: patient_id },
        });
        if (!patient)
            return res.status(422).json({ errors: 'Paciente não localizado' });

        const isDoctor = await User.findOne({
            where: { id: doctor_id, doctor: true },
        });

        if (!isDoctor)
            return res
                .status(422)
                .json({ errors: 'Somente pode-se agendar com médicos' });

        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date()))
            return res
                .status(422)
                .json({ errors: 'Agendamento no passado não é permitido' });

        const checkAvailability = await Appointment.findOne({
            where: {
                doctor_id,
                canceled_at: null,
                date: hourStart,
            },
        });
        const schedule_time = format(hourStart, 'H:mm', { locale: pt });
        const dayOfWeek = getDay(hourStart);

        const doctorSchedule = Schedule.sequelize.query(
            `SELECT id, doctor_id, "day", schedule_time, created_at, updated_at
            FROM public.schedules
            where doctor_id = :doctor and schedule_time = :time and day = :day limit 1`,
            {
                replacements: {
                    doctor: doctor_id,
                    time: dayOfWeek,
                    day: schedule_time,
                },
                type: Schedule.sequelize.QueryTypes.SELECT,
            }
        );

        if (!doctorSchedule)
            return res
                .status(400)
                .json({ errors: 'Este médico não tem agenda neste dia' });

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
        return res.json(appointment);
    }
}

export default new AppointmentController();
