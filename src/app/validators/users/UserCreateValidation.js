import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
            .email()
            .required(),
        password: Yup.string()
            .required()
            .min(6),
        doctor: Yup.boolean().required(),
        specialtyId: Yup.number().when('doctor', (doctor, field) => {
            return doctor ? field.required() : field.notRequired();
        }),
        crm: Yup.string().when('doctor', (doctor, field) => {
            return doctor ? field.required() : field.notRequired();
        }),
    });
    try {
        console.log(req.body);
        await schema.validate(req.body);
    } catch (erro) {
        return res.status(422).json(erro);
    }

    next();
};
