import express from "express";
import PlantController from "../controllers/plants/PlantController";

const plantRouter = express.Router();

plantRouter.use('/', PlantController);

export default plantRouter;