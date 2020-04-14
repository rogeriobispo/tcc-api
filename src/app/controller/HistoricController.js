/* eslint-disable no-param-reassign */
import Appointment from '../models/Appointment';
import Exam from '../models/Exam';
import Medicine from '../models/Medicine';
import User from '../models/User';

class HistoricController {
    async show(req, res) {
        const historic = await Appointment.findAll({
            where: {
                patient_id: req.params.id,
                finished: true,
            },
            order: [['date', 'DESC']],
            attributes: ['id', 'date', 'past', 'description'],
            limit: 10,
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['name'],
                },
                {
                    model: Exam,
                    as: 'exams',
                    attributes: ['name', 'results'],
                },
                {
                    model: Medicine,
                    as: 'medicines',
                    required: false,
                    attributes: ['name', 'factory'],
                },
            ],
        });

        return res.json(historic);
    }
}

export default new HistoricController();
