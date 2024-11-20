import express from "express";
import { LoginRouter, passwordResetRouet, RegisterRoute } from "./auth";
import careReminderRoute from "./careReminder";
import commentsRouter from "./comments";
import messageRoute from "./MessageRoutes";
import { planthealhRoute, plantRouter } from "./plantroute";
import postRoute from "./Postroute";
import profileRoute from "./profile";
import roomRouter from "./roomsRoutes";
import usersRoute from "./usersManagerRoutes";




const mainRoute = express.Router();

mainRoute.use('/auth/register', RegisterRoute);
mainRoute.use('/auth/login', LoginRouter);
mainRoute.use('/profile', profileRoute);
mainRoute.use('/care-reminder', careReminderRoute);
mainRoute.use('/plants', plantRouter);
mainRoute.use('/post', postRoute);
mainRoute.use('/comments', commentsRouter);
mainRoute.use('/rooms', roomRouter);
mainRoute.use('/messages', messageRoute)
mainRoute.use('/users', usersRoute);
mainRoute.use('/auth/password-reset', passwordResetRouet);
mainRoute.use('/plant-logs', planthealhRoute)

export default mainRoute;