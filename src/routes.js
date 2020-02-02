import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';

import ProvidersController from './app/controller/ProvidersController';
import SessionController from './app/controller/SessionController';
import FileController from './app/controller/FileController';
import AppointmentController from './app/controller/AppointmentController';
import SchedulerController from './app/controller/SchedulerController';
import NotificationController from './app/controller/NotificationController';
import authenticated from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authenticated);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.put('/users', UserController.update);

routes.get('/providers', ProvidersController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/schedule', SchedulerController.index);
export default routes;
