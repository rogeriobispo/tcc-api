import * as Yup from 'yup';

export default async (req, res, next) => {
    const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
            .email('Email deve ser valido')
            .required('Email é obrigatório'),
        password: Yup.string('Password Deve ser uma string')
            .required('Senha é obrigatório')
            .min(6, 'Deve conter no minimo 6 caracteres'),
        confirm_password: Yup.string('Confirm Password deve ser string')
            .min(5, 'Senha deve ser maior que 5')
            .required('Confirmação de password é obrigatório')
            .test('is-true', 'Password divergente', function (confirmPassword) {
                return this.parent.password === confirmPassword;
            }),
        admin: Yup.boolean().required('Faltando campo admin'),
        doctor: Yup.boolean('Doctor deve ser um boolean').required(
            'Informar se é um doutor ou não'
        ),
        specialty_id: Yup.number('specialty_id deve ser um numero').when(
            'doctor',
            (doctor, field) => {
                return doctor
                    ? field.required('Especialidade é obrigatorio')
                    : field.notRequired();
            }
        ),
        crm: Yup.string('Crm deve ser uma string').when(
            'doctor',
            (doctor, field) => {
                return doctor
                    ? field.required('Crm é obrigatório')
                    : field.notRequired();
            }
        ),
    });
    try {
        await schema.validate(req.body);
    } catch (erro) {
        return res.status(422).json(erro);
    }

    next();
};
