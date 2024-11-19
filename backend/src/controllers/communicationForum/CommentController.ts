import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { upload } from '../../middlewares/upload/UploadMiddleware';
import { Comment } from '../../models/Comment';
import { Post } from '../../models/Post';

export const CommentController = express.Router();


CommentController.post('/:postId', verifyToken, upload.single('image'), async (req: CustomRequest, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    const image = req.file;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const postRepository = AppDataSource.getRepository(Post);

        const post = await postRepository.findOne({ where: { id: parseInt(postId) } });
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        const newComment = commentRepository.create({
            content,
            post,
            author: { id: userId },
            image: image ? image.path : null,
        });

        await commentRepository.save(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

CommentController.get('/:postId', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comments = await commentRepository.find({
            where: { post: { id: parseInt(postId) } },
            relations: ['author'],
        });


        const responseComments = comments.map(comment => ({
            ...comment,
            author: {
                name: comment.author.name,
                photo: comment.author.profilePhoto,
            }
        }));

        res.status(200).json(responseComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



CommentController.put('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOne({ where: { id: parseInt(id), author: { id: userId } } });

        if (!comment) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }

        comment.content = content || comment.content;

        await commentRepository.save(comment);
        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


CommentController.delete('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = await commentRepository.findOne({ where: { id: parseInt(id), author: { id: userId } } });

        if (!comment) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }

        await commentRepository.remove(comment);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default CommentController;
