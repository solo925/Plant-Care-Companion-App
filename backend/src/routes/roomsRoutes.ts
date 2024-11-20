import express from 'express';
import RoomController from '../controllers/communicationForum/oomController';

const roomRouter = express.Router();

roomRouter.use('/', RoomController);

export default roomRouter;