import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';

import SessionsValidator from './app/validators/session/sessionsValidations';
import UserCreateValidation from './app/validators/users/UserCreateValidation';
import UserUpdateValidation from './app/validators/users/UserUpdateValidation';
import AppointmentCreateValidation from './app/validators/Appointment/AppointmentCreateValidation';
import AvailebleDoctorValidation from './app/validators/Available/AvailebleDoctorValidation';
import SpecialtyCreateValidation from './app/validators/Specialty/SpecialtyCreateValidation';
import PatientValidation from './app/validators/Patient/PatientValidation';

import ProvidersController from './app/controller/ProvidersController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import AppointmentController from './app/controller/AppointmentController';
import SchedulerController from './app/controller/SchedulerController';
import NotificationController from './app/controller/NotificationController';
import authenticated from './app/middlewares/auth';
import AvailableController from './app/controller/AvailableController';
import SpecialtyController from './app/controller/SpecialtyController';
import PatientController from './app/controller/PatientController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionsValidator, SessionController.store);
routes.use(authenticated);

routes.post(
    '/appointments',
    AppointmentCreateValidation,
    AppointmentController.store
);

routes.post('/specialty', SpecialtyCreateValidation, SpecialtyController.store);
routes.put('/specialty/:id', SpecialtyController.update);
routes.get('/specialty', SpecialtyController.index);

routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.post('/users', UserCreateValidation, UserController.store);
routes.put('/users', UserUpdateValidation, UserController.update);

routes.post('/patients', PatientValidation, PatientController.store);
routes.put('/patients', PatientValidation, PatientController.update);

routes.get('/doctors', ProvidersController.index);

routes.get(
    '/doctors/:id/available',
    AvailebleDoctorValidation,
    AvailableController.index
);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/schedule', SchedulerController.index);
export default routes;
