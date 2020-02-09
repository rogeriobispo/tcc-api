import {
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    format,
    isAfter,
    getDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Schedule from '../models/Schedule';

class AvailabilityController {
    async index(req, res) {
        const { date } = req.query;

        if (!date) return res.status(422).json({ error: 'Invalid date' });

        const searchDate = Number(date);

        const appointments = await Appointment.findAll({
            where: {
                doctor_id: req.params.id,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(searchDate),
                        endOfDay(searchDate),
                    ],
                },
            },
        });

        const dayOfWeek = getDay(searchDate);
        const schedules = await Schedule.findAll({
            where: {
                doctor_id: req.params.id,
                day: Number(dayOfWeek),
            },
            attributes: ['schedule_time'],
        });

        const doctor_schedule = schedules.map(sc => sc.schedule_time);

        const avaialble = doctor_schedule.map(time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute),
                0
            );

            return {
                time,
                date: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                avaialble:
                    isAfter(value, new Date()) &&
                    !appointments.find(ap => format(ap.date, 'HH:mm') === time),
            };
        });
        return res.json(avaialble);
    }
}

export default new AvailabilityController();
