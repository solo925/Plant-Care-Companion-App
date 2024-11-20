import express from 'express';
import CareReminderController from '../controllers/careReminder/CareReminder';

const careReminderRoute = express.Router();

careReminderRoute.use('/', CareReminderController);

export default careReminderRoute;
