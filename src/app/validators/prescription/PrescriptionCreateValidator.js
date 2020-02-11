import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        medicine_id: Yup.integer().required(),
        appointment_id: Yup.integer().required(),
    });
    if (!(await schema.isValid(req.body)))
        return res.status(401).json({ error: 'Name is mandatory' });

    next();
};
