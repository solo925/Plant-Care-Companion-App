import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { upload } from '../../middlewares/upload/UploadMiddleware';
import { Post } from '../../models/Post';

export const PostController = express.Router();

PostController.post('/', verifyToken, upload.single('imageUrl'), async (req: CustomRequest, res: Response): Promise<void> => {
    const { title, content, roomId } = req.body;
    const userId = req.user?.id;
    const imageUrl = req.file?.path ?? undefined;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const postRepository = AppDataSource.getRepository(Post);
        const newPost = await postRepository
            .createQueryBuilder()
            .insert()
            .into(Post)
            .values({
                title,
                content,
                author: { id: userId },
                room: roomId ? { id: roomId } : null,
                imageUrl,
            })
            .returning('*')
            .execute();

        res.status(201).json(newPost.raw[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PostController.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const postRepository = AppDataSource.getRepository(Post);
        const posts = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.room', 'room')
            .getMany();

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
        const post = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.room', 'room')
            .where('post.id = :id', { id: parseInt(id) })
            .getOne();

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
        const updateResult = await postRepository
            .createQueryBuilder()
            .update(Post)
            .set({ title, content })
            .where('id = :id AND authorId = :userId', { id: parseInt(id), userId })
            .returning('*')
            .execute();

        if (updateResult.affected === 0) {
            res.status(404).json({ message: 'Post not found or not authorized' });
            return;
        }

        res.status(200).json(updateResult.raw[0]);
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
        const deleteResult = await postRepository
            .createQueryBuilder()
            .delete()
            .from(Post)
            .where('id = :id AND authorId = :userId', { id: parseInt(id), userId })
            .execute();

        if (deleteResult.affected === 0) {
            res.status(404).json({ message: 'Post not found or not authorized' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default PostController;
