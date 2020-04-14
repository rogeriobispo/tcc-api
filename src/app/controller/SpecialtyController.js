import Specialty from '../models/Specialty';

class UserController {
    async index(_, res) {
        const especialties = await Specialty.findAll({
            attributes: ['id', 'name', 'created_at'],
        });
        return res.json(especialties);
    }

    async show(req, res) {
        const especialty = await Specialty.findByPk(req.params.id);
        if (!especialty)
            res.status(404).json({ errors: 'Especialidade não existe' });
        return res.json(especialty);
    }

    async store(req, res) {
        const specialtyExists = await Specialty.findOne({
            where: { name: req.body.name },
        });

        if (specialtyExists)
            return res.status(400).json({ errors: 'Especialidade ja existe' });

        const specialty = await Specialty.create(req.body);

        const { id, name } = specialty;
        return res.json({
            id,
            name,
        });
    }

    async update(req, res) {
        const { name: newName } = req.body;

        const specialtyExists = await Specialty.findOne({
            where: { name: newName },
        });
        if (specialtyExists)
            return res.status(422).json({ errors: 'Especialidade ja existe' });

        const specialty = await Specialty.findByPk(req.params.id);

        const { id, name } = await specialty.update(req.body);

        return res.json({
            id,
            name,
        });
    }

    async delete(req, res) {
        const spec = await Specialty.findByPk(req.params.id);

        if (!spec)
            return res
                .status(404)
                .json({ errors: 'Especialidade não localizado' });

        await spec.destroy();
        return res.status(204);
    }
}

export default new UserController();
