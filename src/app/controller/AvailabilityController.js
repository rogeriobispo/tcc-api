import {
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    format,
    isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

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

        const shchedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
        ];
        const avaialble = shchedule.map(time => {
            const [hour, minute] = time.split(':');
            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute),
                0
            );

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                avaialble:
                    isAfter(value, new Date()) &&
                    !appointments.find(ap => format(ap.date, 'HH:mm') === time),
            };
        });
        return res.json(avaialble);
    }
}

export default new AvailabilityController();