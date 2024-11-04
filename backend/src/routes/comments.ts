import express from 'express';
import CommentController from '../controllers/communicationForum/CommentController';

const commentsRouter = express.Router()

commentsRouter.use('/', CommentController);

export default commentsRouter;