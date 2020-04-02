/* eslint-disable no-param-reassign */
import Appointment from '../models/Appointment';
import Patient from '../models/Patient';
import Exame from '../models/Exam';

class ExamController {
    async store(req, res) {
        const { patient_id, appointment_id } = req.body;

        const patient = await Patient.findOne({
            where: {
                id: patient_id,
            },
        });

        const appointment = await Appointment.findOne({
            where: {
                id: appointment_id,
            },
        });
        if (!appointment)
            return res
                .status(422)
                .json({ error: 'Atendimento não encontrado' });

        if (!patient)
            return res.status(422).json({ error: 'Paciente não encontrado' });

        const ex = await Exame.create(req.body);

        return res.json(ex);
    }

    async update(req, res) {
        const examId = req.body.id;
        const exam = await Exame.findOne({
            where: {
                id: examId,
            },
        });

        if (!exam)
            return res.status(422).json({ error: 'Exame não localizado' });

        const examUpdated = await exam.update(req.body);

        return res.json(examUpdated);
    }
}

export default new ExamController();
