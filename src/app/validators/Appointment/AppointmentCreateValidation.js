import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        doctor_id: Yup.number().required('Doutor é obrigatório'),
        patient_id: Yup.number().required('Paciente é obrigatório'),
        date: Yup.date().required('Data de agendamento é obrigatória'),
    });

    try {
        await schema.isValid(req.body);
    } catch (error) {
        return res.status(422).json({ errors: error });
    }

    next();
};
