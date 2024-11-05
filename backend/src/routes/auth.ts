import express from 'express';
import LoginController from '../controllers/Auth/loginController';
import RegistrationController from "../controllers/Auth/RegisterController";
import PasswordResetController from '../controllers/Auth/ResetPassword';

export const RegisterRoute = express.Router();
export const LoginRouter = express.Router();
export const passwordResetRouet = express.Router();

RegisterRoute.use('/', RegistrationController);
LoginRouter.use('/', LoginController);
passwordResetRouet.use('/', PasswordResetController);


