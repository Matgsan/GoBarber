import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';
import providerMiddleware from './app/middlewares/provider';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);
routes.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});
routes.post('/users', UserController.store);
routes.use('/users', authMiddleware);
routes.put('/users', UserController.update);

routes.post('/sessions', SessionController.store);

routes.use('/providers', authMiddleware);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.use('/files', authMiddleware);
routes.post('/files', upload.single('file'), FileController.store);

routes.use('/appointments', authMiddleware);
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.use('/notifications', [authMiddleware, providerMiddleware]);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.use('/schedule', [authMiddleware, providerMiddleware]);
routes.get('/schedule', ScheduleController.index);

export default routes;
