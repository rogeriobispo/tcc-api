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
import Prescription from '../models/Prescriptions';
import Medicine from '../models/Medicine';
import User from '../models/User';
import Patient from '../models/Patient';
import Schedule from '../models/Schedule';

class AppointmentController {
    async show(req, res) {
        const { id } = req.params;
        const prescription = await Prescription.findAll({
            where: {
                appointment_id: id,
            },
            include: [
                {
                    model: Appointment,
                    as: 'appointment',
                    attributes: ['id', 'description'],
                    include: [
                        {
                            model: User,
                            as: 'doctor',
                            attributes: ['name'],
                        },
                        {
                            model: Patient,
                            as: 'patient',
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: Medicine,
                    as: 'medicine',
                    attributes: ['id', 'name', 'factory'],
                },
            ],
            attributes: ['appointment_id', 'medicine_id'],
        });
        res.json(prescription);
    }

    async index(req, res) {
        const { id: patient_id } = req.params;

        const appointments = await Appointment.findAll({
            where: {
                patient_id,
                canceled_at: null,
            },

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

                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name'],
                },
            ],
        });
        return res.json(appointments);
    }

    async store(req, res) {
        const { doctor_id, date, patient_id } = req.body;
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
                .json({ errors: 'A data de agendamento não esta disponivel' });
        const appointment = await Appointment.create({
            patient_id,
            doctor_id,
            date: req.body.date,
        });

        return res.json({ appointment });
    }

    async update(req, res) {
        const { body } = req;
        const appointment = await Appointment.findOne({
            where: { id: req.params.id },
        });
        if (!appointment)
            return res
                .status(422)
                .json({ errors: 'Agendamento não localizado' });

        const updatedAppointment = await appointment.update(body);

        return res.json(updatedAppointment);
    }

    async delete(req, res) {
        const appointment = await Appointment.findByPk(req.params.id);

        const datewithSub = subHours(appointment.date, 2);

        if (isBefore(datewithSub, new Date()))
            return res.status(422).json({
                erros:
                    'Você só pode cancelar agendamento com duas horas de antecedencia',
            });

        appointment.canceled_at = new Date();
        await appointment.save();
        return res.json(appointment);
    }
}

export default new AppointmentController();
