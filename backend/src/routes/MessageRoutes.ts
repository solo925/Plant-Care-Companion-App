import express from 'express';
import MessageController from '../controllers/communicationForum/MessageController';

const messageRoute = express.Router();

messageRoute.use('/', MessageController);

export default messageRoute;