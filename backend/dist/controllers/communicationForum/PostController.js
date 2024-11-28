"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const UploadMiddleware_1 = require("../../middlewares/upload/UploadMiddleware");
const Post_1 = require("../../models/Post");
exports.PostController = express_1.default.Router();
exports.PostController.post('/', IsAuthenticated_1.verifyToken, UploadMiddleware_1.upload.single('imageUrl'), async (req, res) => {
    var _a;
    const { title, content, roomId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const imageUrl = req.file ? req.file.path : null;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const newPost = postRepository.create({
            title,
            content,
            author: { id: userId },
            room: roomId ? { id: roomId } : null,
            imageUrl,
        });
        await postRepository.save(newPost);
        res.status(201).json({ data: newPost, message: 'Post created successfully' });
        console.log(newPost.imageUrl);
        console.log(newPost.author.name);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PostController.get('/', async (req, res) => {
    try {
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const posts = await postRepository.find({ relations: ['author', 'room'] }); // Fetch posts with author and room relations
        res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PostController.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const post = await postRepository.findOne({ where: { id: parseInt(id) }, relations: ['author', 'room'] });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PostController.put('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const post = await postRepository.findOne({ where: { id: parseInt(id) }, relations: ['author'] });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        if (post.author.id !== userId) {
            res.status(403).json({ message: 'Not authorized to update this post' });
            return;
        }
        post.title = title !== null && title !== void 0 ? title : post.title;
        post.content = content !== null && content !== void 0 ? content : post.content;
        await postRepository.save(post);
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PostController.delete('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const postRepository = data_source_1.AppDataSource.getRepository(Post_1.Post);
        const post = await postRepository.findOne({ where: { id: parseInt(id) }, relations: ['author'] });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        if (post.author.id !== userId) {
            res.status(403).json({ message: 'Not authorized to delete this post' });
            return;
        }
        await postRepository.remove(post);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.PostController;
