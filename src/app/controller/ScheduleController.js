import User from '../models/User';
import Schedule from '../models/Schedule';

class ScheduleController {
    async index(req, res) {
        const schedules = await Schedule.findAll({
            where: { doctor_id: req.params.id },
        });
        res.json(schedules);
    }

    async store(req, res) {
        const { day, schedule_time, doctor_id } = req.body;

        const checkUserDoctor = await User.findOne({
            where: { id: doctor_id, doctor: true },
        });

        const [, minuto] = schedule_time.split(':');
        if (!['00', '30'].includes(minuto))
            return res.status(422).json({
                error: 'O minuto da agenda deve ser de 30 ou 00 minuto',
            });

        if (!checkUserDoctor)
            return res.status(422).json({ error: 'Médico não encontrado' });

        const checkSchedule = await Schedule.findOne({
            where: { doctor_id, day, schedule_time },
        });

        if (checkSchedule)
            return res
                .status(422)
                .json({ error: 'Horário já cadastrado na agenda do médico' });

        const schedule = await Schedule.create({
            doctor_id,
            day,
            schedule_time,
        });

        return res.json(schedule);
    }

    async delete(req, res) {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id);
        if (!schedule)
            return res.status(422).json({ error: 'Agenda não localizada' });

        await schedule.destroy();
        return res.status(204).json();
    }
}

export default new ScheduleController();
