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
import PrescriptionCreateValidator from './app/validators/prescription/PrescriptionCreateValidator';

import UserController from './app/controller/UserController';
import DoctorsController from './app/controller/DoctorsController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import AppointmentController from './app/controller/AppointmentController';
import DoctorApointmentController from './app/controller/DoctorApointmentController';
import NotificationController from './app/controller/NotificationController';
import AvailabilityController from './app/controller/AvailabilityController';
import SpecialtyController from './app/controller/SpecialtyController';
import PatientController from './app/controller/PatientController';
import ScheduleController from './app/controller/ScheduleController';
import MedicineController from './app/controller/MedicineController ';
import PrescriptionController from './app/controller/PrescriptionController';

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

routes.post(
    '/appointments/:appointment_id/medicine/:medicine_id',
    PrescriptionController.store
);

routes.post('/prescription', PrescriptionCreateValidator); // faltar criar model e controller

routes.post('/specialty', SpecialtyCreateValidation, SpecialtyController.store);
routes.put('/specialty/:id', SpecialtyController.update);
routes.get('/specialty', SpecialtyController.index);

routes.post('/users', UserCreateValidation, UserController.store);
routes.put('/users', UserUpdateValidation, UserController.update);

routes.post('/schedule', ScheduleCreateValidation, ScheduleController.store);
routes.delete('/schedule/:id', ScheduleController.delete);

routes.get('/medicines', MedicineController.index);
routes.post('/medicines', MedicineCreateValidation, MedicineController.store);
routes.delete('/medicines/:id', MedicineController.delete);

routes.get('/patients/:id/appointments', PatientController.index);
routes.post('/patients', PatientValidation, PatientController.store);
routes.put('/patients', PatientValidation, PatientController.update);

routes.get(
    '/doctors/:id/availability',
    AvailabilityDoctorValidation,
    AvailabilityController.index
);

routes.get('/doctors', DoctorsController.index);
routes.get('/doctors/:id/appointments', DoctorApointmentController.index);
routes.get('/doctor/:id/schedules/', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
