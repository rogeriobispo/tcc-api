import Patient from '../models/Patient';
import Appointment from '../models/Appointment';
import File from '../models/File';

class PatientController {
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
        const patientExists = await Patient.findOne({
            where: { document: req.body.document },
        });
        if (patientExists)
            return res
                .status(400)
                .json({ error: 'Paciente Já existe na base' });

        const patient = await Patient.create(req.body);
        const { id, name, document, age } = patient;
        return res.json({
            id,
            name,
            document,
            age,
        });
    }

    async update(req, res) {
        const { document } = req.body;

        const patient = await Patient.findOne({ where: { document } });
        if (!patient)
            return res
                .status(422)
                .json({ error: 'Não existe pasciente com este documento' });

        const { id, name, age } = await patient.update(req.body);

        return res.json({
            id,
            name,
            document,
            age,
        });
    }
}

export default new PatientController();
