import express from "express";
import ProfileController from "../controllers/userProfile/ProfileController";

const profileroute = express.Router();

profileroute.use('/', ProfileController);

export default profileroute;