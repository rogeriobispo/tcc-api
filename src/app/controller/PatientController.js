import Patient from '../models/Patient';

class PatientController {
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
