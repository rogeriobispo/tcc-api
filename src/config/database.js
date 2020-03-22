module.exports = {
    dialect: 'postgres',
    timezone: '+05:30',
    host: 'localhost',
    port: '5431',
    username: 'root',
    password: 'root',
    database: 'clinicalCare',
    define: {
        timesstamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
