import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dataBaseConfig from '../config/database';
import User from '../app/models/User';
import Appointment from '../app/models/Appointment';
import File from '../app/models/File';
import Specialty from '../app/models/Specialty';
import Patient from '../app/models/Patient';

const models = [User, File, Appointment, Specialty, Patient];

class Database {
    constructor() {
        this.init();
        this.mongo();
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

    mongo() {
        this.mongooseconnection = mongoose.connect(
            'mongodb://localhost:27017/clinicalCare',
            { useNewUrlParser: true, useFindAndModify: true }
        );
    }
}

export default new Database();
