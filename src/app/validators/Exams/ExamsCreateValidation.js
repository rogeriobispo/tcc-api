import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        with: Yup.string().required('Campo Manter com é obrigatório'),
        name: Yup.string().required('O nome do exame é obrigatório'),
        partient_id: Yup.number().required('Paciente é obrigatório'),
    });

    try {
        await schema.isValid(req.body);
    } catch (error) {
        return res.status(422).json({ errors: error });
    }

    next();
};
