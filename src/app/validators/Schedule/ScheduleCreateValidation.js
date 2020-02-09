import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        doctor_id: Yup.number().required(),
        day: Yup.number()
            .required()
            .min(0)
            .max(6),
        schedule_time: Yup.string()
            .required()
            .length(5)
            .matches(/^[0-9]{2}:[0-9]{2}$/, {
                message: 'Horario no formato invalido exemplo: 08:00',
            }),
    });

    try {
        await schema.validate(req.body);
    } catch (erro) {
        return res.status(422).json(erro);
    }

    next();
};
