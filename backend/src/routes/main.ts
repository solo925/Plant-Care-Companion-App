import express from "express";
import RegisterRoute from "./auth";

const mainRoute = express.Router();

mainRoute.use('/auth/register', RegisterRoute);

export default mainRoute;