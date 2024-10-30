import express from "express";
import RegisterRoute from "./auth";
import careReminderRoute from "./careReminder";
import profileRoute from "./profile";


const mainRoute = express.Router();

mainRoute.use('/auth/register', RegisterRoute);
mainRoute.use('/profile', profileRoute);
mainRoute.use('/care-reminder', careReminderRoute);

export default mainRoute;