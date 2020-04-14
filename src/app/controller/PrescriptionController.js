import Medicine from '../models/Medicine';
import Appointment from '../models/Appointment';
import Prescription from '../models/Prescriptions';

class PrescriptionController {
    async store(req, res) {
        const { medicine_id, appointment_id, dose } = req.body;
        const medicine = await Medicine.findOne({ where: { id: medicine_id } });
        if (!medicine)
            return res
                .status(422)
                .json({ error: 'Medicamento não encontrado' });

        const appointment = await Appointment.findOne({
            where: { id: appointment_id },
        });
        if (!appointment)
            return res.status(422).json({ error: 'Consulta não localizada' });

        const prescription = await Prescription.create({
            medicine_id,
            appointment_id,
            dose,
        });

        return res.status(201).json(prescription);
    }
}

export default new PrescriptionController();
