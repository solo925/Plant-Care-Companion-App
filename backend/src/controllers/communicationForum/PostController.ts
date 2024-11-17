import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { upload } from '../../middlewares/upload/UploadMiddleware';
import { Post } from '../../models/Post';

export const PostController = express.Router();


PostController.post('/', verifyToken, upload.single('imageUrl'), async (req: CustomRequest, res: Response): Promise<void> => {
    const { title, content, roomId } = req.body;
    const userId = req.user?.id;
    const imageUrl: any = req.file ? req.file.path : null;


    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const postRepository = AppDataSource.getRepository(Post);

        const newPost = postRepository.create({
            title,
            content,
            author: { id: userId },
            room: roomId ? { id: roomId } : null,
            imageUrl,
        });

        await postRepository.save(newPost);
        res.status(201).json({ data: newPost, message: 'Post created successfully' });
        console.log(newPost.imageUrl)
        console.log(newPost.author.name)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PostController.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const postRepository = AppDataSource.getRepository(Post);
        const posts = await postRepository.find({ relations: ['author', 'room'] }); // Fetch posts with author and room relations
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PostController.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({ where: { id: parseInt(id) }, relations: ['author', 'room'] });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PostController.put('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.id;

    try {
        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOne({ where: { id: parseInt(id) }, relations: ['author'] });

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }


        if (post.author.id !== userId) {
            res.status(403).json({ message: 'Not authorized to update this post' });
            return;
        }


        post.title = title ?? post.title;
        post.content = content ?? post.content;

        await postRepository.save(post);
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PostController.delete('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const postRepository = AppDataSource.getRepository(Post);
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default PostController;
