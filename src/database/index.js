import Sequelize from 'sequelize';
import dataBaseConfig from '../config/database';
import User from '../app/models/User';
import Appointment from '../app/models/Appointment';
import File from '../app/models/File';
import Specialty from '../app/models/Specialty';
import Patient from '../app/models/Patient';
import Schedule from '../app/models/Schedule';
import Medicine from '../app/models/Medicine';
import Prescription from '../app/models/Prescriptions';
import Exam from '../app/models/Exam';

const models = [
    User,
    File,
    Appointment,
    Specialty,
    Patient,
    Schedule,
    Medicine,
    Prescription,
    Exam,
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(dataBaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
