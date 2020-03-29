import { Router } from 'express';
import multer from 'multer';
import Cors from 'cors';
import multerConfig from './config/multer';

import SessionsValidator from './app/validators/session/sessionsValidations';
import UserCreateValidation from './app/validators/users/UserCreateValidation';
import UserUpdateValidation from './app/validators/users/UserUpdateValidation';
import AppointmentCreateValidation from './app/validators/Appointment/AppointmentCreateValidation';
import AvailabilityDoctorValidation from './app/validators/Availability/AvailabilityDoctorValidation';
import SpecialtyCreateValidation from './app/validators/Specialty/SpecialtyCreateValidation';
import PatientValidation from './app/validators/Patient/PatientValidation';
import ScheduleCreateValidation from './app/validators/Schedule/ScheduleCreateValidation';
import MedicineCreateValidation from './app/validators/Medicine/MedicineCreateValidation';
import ExamsCreateValidation from './app/validators/Exams/ExamsCreateValidation';

import UserController from './app/controller/UserController';
import DoctorsController from './app/controller/DoctorsController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import AppointmentController from './app/controller/AppointmentController';
import DoctorApointmentController from './app/controller/DoctorApointmentController';
import AvailabilityController from './app/controller/AvailabilityController';
import SpecialtyController from './app/controller/SpecialtyController';
import PatientController from './app/controller/PatientController';
import ScheduleController from './app/controller/ScheduleController';
import MedicineController from './app/controller/MedicineController ';
import PrescriptionController from './app/controller/PrescriptionController';
import ExamController from './app/controller/ExamController';

import Authenticated from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.use(Cors());
routes.post('/sessions', SessionsValidator, SessionController.store);

routes.use(Authenticated);

routes.post(
    '/appointments',
    AppointmentCreateValidation,
    AppointmentController.store
);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.put('/appointments/:id', AppointmentController.update);
routes.get('/appointments/:id', AppointmentController.show);

routes.post(
    '/appointments/:appointment_id/medicine/:medicine_id',
    PrescriptionController.store
);

routes.post('/specialty', SpecialtyCreateValidation, SpecialtyController.store);
routes.put('/specialty/:id', SpecialtyController.update);
routes.get('/specialty/:id', SpecialtyController.show);
routes.get('/specialty', SpecialtyController.index);

routes.post('/users', UserCreateValidation, UserController.store);
routes.put('/users/:id', UserUpdateValidation, UserController.update);
routes.get('/users/:id', UserUpdateValidation, UserController.show);
routes.get('/users', UserController.index);

routes.post('/schedule', ScheduleCreateValidation, ScheduleController.store);
routes.delete('/schedule/:id', ScheduleController.delete);

routes.get('/medicines', MedicineController.index);
routes.post('/medicines', MedicineCreateValidation, MedicineController.store);
routes.get('/medicines/:id', MedicineController.show);
routes.delete('/medicines/:id', MedicineController.delete);
routes.put(
    '/medicines/:id',
    MedicineCreateValidation,
    MedicineController.update
);

routes.get('/patients/:id/appointments', AppointmentController.index);
routes.get('/patients', PatientController.index);
routes.get('/patients/:id', PatientController.show);

routes.post('/patients', PatientValidation, PatientController.store);
routes.put('/patients', PatientValidation, PatientController.update);

routes.get(
    '/doctors/:id/availability',
    AvailabilityDoctorValidation,
    AvailabilityController.index
);

routes.get('/doctors', DoctorsController.index);
routes.get('/doctors/:id/appointments', DoctorApointmentController.index);
routes.get('/doctors/:id/schedules/', ScheduleController.index);

routes.post('/exams', ExamsCreateValidation, ExamController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
