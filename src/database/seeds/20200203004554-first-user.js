module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'admin',
                    email: 'admin@admin.com',
                    password_hash:
                        '$2b$08$sfyKalEORQPPHUAqDFjb8u0ucVRDWjirjmNKYrLH0sN7mVY9wGVjS', // senha 123456
                    doctor: false,
                    roles: 'admin',
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
