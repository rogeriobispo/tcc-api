import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        document: Yup.string().required(),
        age: Yup.string().required(),
    });
    try {
        await schema.validate(req.body);
    } catch (erro) {
        return res.status(422).json(erro);
    }

    next();
};
