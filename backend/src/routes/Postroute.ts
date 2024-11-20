import express from 'express';
import PostController from '../controllers/communicationForum/PostController';

const postRoute = express.Router();

postRoute.use('/', PostController);

export default postRoute;