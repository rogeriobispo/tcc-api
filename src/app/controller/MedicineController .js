import Medicine from '../models/Medicine';

class MedicineController {
    async index(_, res) {
        const medicines = await Medicine.findAll();
        res.json(medicines);
    }

    async show(req, res) {
        const { id } = req.params;
        const medicine = await Medicine.findByPk(id);
        if (!medicine)
            return res
                .status(422)
                .json({ errors: 'Medicamento não localizada' });

        return res.status(200).json(medicine);
    }

    async store(req, res) {
        const { name, factory } = req.body;
        const medicine = await Medicine.findOne({
            where: { name, factory },
        });

        if (medicine)
            return res
                .status(422)
                .json({ errors: 'Medicamento ja cadastrado' });

        const newMedicine = await Medicine.create({
            name,
            factory,
        });
        return res.json(newMedicine);
    }

    async delete(req, res) {
        const { id } = req.params;
        const medicine = await Medicine.findByPk(id);
        if (!medicine)
            return res
                .status(422)
                .json({ errors: 'Medicamento não localizada' });

        await Medicine.softDelete({ where: { id } });
        return res.status(204).json();
    }

    async update(req, res) {
        const { id } = req.params;
        const medicine = await Medicine.findByPk(id);

        if (!medicine)
            return res
                .status(404)
                .json({ errors: 'Medicamento nao localizado' });

        await medicine.update(req.body);

        return res.json(medicine);
    }
}

export default new MedicineController();
