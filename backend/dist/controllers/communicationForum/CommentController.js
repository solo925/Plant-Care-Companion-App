"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const UploadMiddleware_1 = require("../../middlewares/upload/UploadMiddleware");
const Comment_1 = require("../../models/Comment");
const Post_1 = require("../../models/Post");
exports.CommentController = express_1.default.Router();
exports.CommentController.post('/:postId', IsAuthenticated_1.verifyToken, UploadMiddleware_1.upload.single('image'), async (req, res) => {
    var _a;
    const { postId } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const image = req.file;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        const commentRepository = data_source_1.AppDataSource.getRepository(Comment_1.Comment);
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const post = await postRepository.findOne({ where: { id: parseInt(postId) } });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const newComment = commentRepository.create({
            content,
            post,
            author: { id: userId },
            image: image ? image.path : undefined,
        });
        await commentRepository.save(newComment);
        res.status(201).json({
            message: 'Comment posted successfully',
            comment: newComment,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.CommentController.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const commentRepository = data_source_1.AppDataSource.getRepository(Comment_1.Comment);
        const comments = await commentRepository.find({
            where: { post: { id: parseInt(postId) } },
            relations: ['author'],
        });
        const responseComments = comments.map(comment => (Object.assign(Object.assign({}, comment), { author: {
                name: comment.author.name,
                photo: comment.author.profilePhoto,
            } })));
        res.status(200).json(responseComments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.CommentController.put('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const commentRepository = data_source_1.AppDataSource.getRepository(Comment_1.Comment);
        const comment = await commentRepository.findOne({ where: { id: parseInt(id), author: { id: userId } } });
        if (!comment) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }
        comment.content = content || comment.content;
        await commentRepository.save(comment);
        res.status(200).json(comment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.CommentController.delete('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const commentRepository = data_source_1.AppDataSource.getRepository(Comment_1.Comment);
        const comment = await commentRepository.findOne({ where: { id: parseInt(id), author: { id: userId } } });
        if (!comment) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }
        await commentRepository.remove(comment);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.CommentController;
