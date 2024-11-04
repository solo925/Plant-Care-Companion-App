import express from 'express';
import RegistrationController from "../controllers/Auth/RegisterController";
import LoginController from '../controllers/Auth/loginController';

export const RegisterRoute = express.Router();
export const LoginRouter = express.Router();

RegisterRoute.use('/', RegistrationController);
LoginRouter.use('/', LoginController);

