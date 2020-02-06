import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        old_password: Yup.string().min(6),
        password: Yup.string()
            .min(6)
            .when('old_password', (old_password, field) =>
                old_password ? field.required() : field
            ),
        confirm_password: Yup.string().when('password', (password, field) =>
            password ? field.required([Yup.ref('password')]) : field
        ),
        doctor: Yup.boolean(),
        specialty_id: Yup.number().when('doctor', (doctor, field) => {
            return doctor ? field.required() : field.notRequired();
        }),
        crm: Yup.string().when('doctor', (doctor, field) => {
            return doctor ? field.required() : field.notRequired();
        }),
    });

    try {
        await schema.validate(req.body);
    } catch (erro) {
        return res.status(422).json(erro);
    }

    next();
};
