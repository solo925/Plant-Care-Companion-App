import express from 'express';
import UserController from '../controllers/usersManagement/GetAllUsers';

const usersRoute = express.Router();

usersRoute.use('/', UserController);

export default usersRoute;