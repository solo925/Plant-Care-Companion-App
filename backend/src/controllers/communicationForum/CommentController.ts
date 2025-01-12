import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { upload } from '../../middlewares/upload/UploadMiddleware';
import { Comment } from '../../models/Comment';
import { Post } from '../../models/Post';
import { addPostActionToQueue } from '../../bull/job_Queue_for_post';

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
        const postExists = await AppDataSource.getRepository(Post)
        .exists({ where: { id: parseInt(postId) } });
        if (!postExists) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        await addPostActionToQueue(Number(postId),'comments',userId);

        const newComment = await AppDataSource.getRepository(Comment).save({
            content,
            post: { id: parseInt(postId) },
            author: { id: userId },
            image: image?.path,
        });

        res.status(201).json({
            message: 'Comment posted successfully',
            comment: newComment,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


CommentController.get('/:postId', async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const commentRepository = AppDataSource.getRepository(Comment);
        const [comments, total] = await commentRepository.findAndCount({
            where: { post: { id: parseInt(postId) } },
            relations: ['author'],
            take: parseInt(limit as string),
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            order: { createdAt: 'DESC' },
        });

        res.status(200).json({
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            comments: comments.map(comment => ({
                ...comment,
                author: {
                    name: comment.author.name,
                    photo: comment.author.profilePhoto,
                },
            })),
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


CommentController.put('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    try {
        const result = await AppDataSource.getRepository(Comment)
            .createQueryBuilder()
            .update(Comment)
            .set({ content })
            .where("id = :id AND authorId = :userId", { id: parseInt(id), userId })
            .execute();

        if (result.affected === 0) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }

        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

CommentController.delete('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const result = await AppDataSource.getRepository(Comment)
            .createQueryBuilder()
            .delete()
            .where("id = :id AND authorId = :userId", { id: parseInt(id), userId })
            .execute();

        if (result.affected === 0) {
            res.status(404).json({ message: 'Comment not found or not authorized' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default CommentController;
