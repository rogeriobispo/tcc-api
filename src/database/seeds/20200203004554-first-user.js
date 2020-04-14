module.exports = {
    up: (queryInterface, _) =>
        queryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'admin',
                    email: 'admin@admin.com',
                    password_hash:
                        '$2b$08$sfyKalEORQPPHUAqDFjb8u0ucVRDWjirjmNKYrLH0sN7mVY9wGVjS', // senha 123456
                    doctor: false,
                    roles: 'Admin',
                    created_at: '2020-02-01 18:40:57.443+00',
                    updated_at: '2020-02-01 18:40:57.443+00',
                },
                {
                    name: 'medico',
                    email: 'medico@medico.com',
                    password_hash:
                        '$2b$08$sfyKalEORQPPHUAqDFjb8u0ucVRDWjirjmNKYrLH0sN7mVY9wGVjS', // senha 123456
                    doctor: true,
                    roles: '',
                    created_at: '2020-02-01 18:40:57.443+00',
                    updated_at: '2020-02-01 18:40:57.443+00',
                },
                {
                    name: 'atendente',
                    email: 'atendente@atendente.com',
                    password_hash:
                        '$2b$08$sfyKalEORQPPHUAqDFjb8u0ucVRDWjirjmNKYrLH0sN7mVY9wGVjS', // senha 123456
                    doctor: false,
                    roles: 'Recepcionist',
                    created_at: '2020-02-01 18:40:57.443+00',
                    updated_at: '2020-02-01 18:40:57.443+00',
                },
            ],
            {}
        ),
    down: queryInterface => {
        return queryInterface.bulkDelete('People', null, {});
    },
};
