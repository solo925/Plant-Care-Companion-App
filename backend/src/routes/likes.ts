import { Router } from "express";
import { toggleLikeControler,getLikesCountController } from "../controllers/communicationForum/likesController";
import express from 'express'


const likesRouter = express.Router();
const getlikesRouter = express.Router()

likesRouter.use("/", toggleLikeControler );
getlikesRouter.use("/",getLikesCountController)

export default likesRouter;
