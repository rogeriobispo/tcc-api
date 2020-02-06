import Doctor from '../../models/User';

export default async (req, res, next) => {
    const { id: doctor_id } = req.params;
    console.log('##########################################', doctor_id);
    const doctor = await Doctor.findOne({
        limit: 1,
        where: {
            id: doctor_id,
            doctor: true,
        },
    });

    if (!doctor)
        return res
            .status(422)
            .json({ error: 'Este não é um médico, portanto não tem agenda' });

    next();
};
