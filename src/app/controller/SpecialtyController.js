import Specialty from '../models/Specialty';

class UserController {
    async index(req, res) {
        const especialties = await Specialty.findAll();
        return res.json(especialties);
    }

    async store(req, res) {
        const specialtyExists = await Specialty.findOne({
            where: { name: req.body.name },
        });

        if (specialtyExists)
            return res.status(400).json({ error: 'Specialty already exists' });

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
            return res.status(422).json({ error: 'Specialty already exists' });
        console.log(req.params.id);
        const specialty = await Specialty.findByPk(req.params.id);

        const { id, name } = await specialty.update(req.body);

        return res.json({
            id,
            name,
        });
    }
}

export default new UserController();
