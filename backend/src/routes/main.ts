import express from "express";
import { LoginRouter, RegisterRoute } from "./auth";
import careReminderRoute from "./careReminder";
import plantRouter from "./plantroute";
import profileRoute from "./profile";



const mainRoute = express.Router();

mainRoute.use('/auth/register', RegisterRoute);
mainRoute.use('/auth/login', LoginRouter);
mainRoute.use('/profile', profileRoute);
mainRoute.use('/care-reminder', careReminderRoute);
mainRoute.use('/plants', plantRouter);

export default mainRoute;