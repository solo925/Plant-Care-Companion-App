import express from 'express';
import RegistrationController from "../controllers/Auth/RegisterController";

const RegisterRoute = express.Router();

RegisterRoute.use('/', RegistrationController);

export default RegisterRoute;