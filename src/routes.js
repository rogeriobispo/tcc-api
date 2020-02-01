import { Router } from 'express';

import UserController from './app/controller/UserController';

import SessionController from './app/controller/SessionController';
import authenticated from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authenticated);
routes.put('/users', UserController.update);

export default routes;
