import Patient from '../models/Patient';
import File from '../models/File';

class PatientController {
    async index(_, res) {
        const patients = await Patient.findAll({
            attributes: [
                'id',
                'document',
                'age',
                'name',
                'email',
                'cel',
                'phone',
                'created_at',
            ],
            include: {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
            },
        });
        res.status(200).json(patients);
    }

    async show(req, res) {
        const user = await Patient.findByPk(req.params.id, {
            attributes: [
                'id',
                'document',
                'age',
                'name',
                'email',
                'cel',
                'phone',
                'created_at',
            ],
        });
        if (user) res.status(200).json(user);

        res.status(404);
    }

    async store(req, res) {
        const patientExists = await Patient.findOne({
            where: { document: req.body.document },
        });
        if (patientExists)
            return res.status(400).json({ errors: 'Paciente Já existe' });

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
                .json({ errors: 'Não existe pasciente com este documento' });

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
