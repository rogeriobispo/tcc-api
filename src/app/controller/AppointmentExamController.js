/* eslint-disable no-param-reassign */
import Exam from '../models/Exam';
import Patient from '../models/Patient';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentExamController {
    async show(req, res) {
        const apiId = req.params.id;
        const { finished = false } = req.query;
        const exam = await Exam.findAll({
            where: {
                appointment_id: apiId,
                finished,
            },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'name'],
                },
                {
                    model: Appointment,
                    as: 'appointment',
                    attributes: ['id', 'doctor_id'],
                    include: [
                        {
                            model: User,
                            as: 'doctor',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ],
        });

        res.json(exam);
    }
}

export default new AppointmentExamController();
