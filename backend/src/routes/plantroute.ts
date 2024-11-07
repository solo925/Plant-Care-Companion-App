import express from "express";
import PlantController from "../controllers/plants/PlantController";
import PlantHealthLogController from "../controllers/plants/PlantHealthTracker";

export const plantRouter = express.Router();
export const planthealhRoute = express.Router();

planthealhRoute.use('/', PlantHealthLogController)
plantRouter.use('/', PlantController);

