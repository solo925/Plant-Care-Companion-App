import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Post } from "../../models/Post";
import User from "../../models/User";
import express from 'express'
import { verifyToken } from "../../middlewares/Authmidlewares/IsAuthenticated";
import { AppDataSource } from "../../config/data-source";

const toggleLikeControler = express.Router()
const getLikesCountController = express.Router();

export interface R extends Request{
    user?:{
        id?:string
    }
}

toggleLikeControler.post('/:postId/like', verifyToken, async (req: R, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = req.user?.id;
    // hello change this

    try {
        // Check Cache first
        let post = await getCachedPost(Number(postId));
        if (!post) {
            const postRepository = AppDataSource.getRepository(Post);
            post = await postRepository.findOne({ where: { id: Number(postId) }, relations: ['likedBy'] });
            if (!post) {
                res.status(404).json({ message: "Post not found" });
                return;
            }
            // Cache the post
            await cachePopularPost(Number(postId), post);
        }

        // Check if the like count is cached
        let cachedLikes = await getCachedLikesCount(Number(postId));
        if (cachedLikes !== null) {
            post.likes = cachedLikes;
        }

        // Check Rate Limiting
        await rateLimitMiddleware(req, res, () => {});

        // Add the action to the queue
        await addPostActionToQueue(Number(postId), 'like', userId!);

        res.json({ likes: post.likes });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like" });
    }
});


getLikesCountController.get("/:postId/likes", verifyToken, async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    const postRepository = AppDataSource.getRepository(Post);

    try {
        const post = await postRepository.findOne({
            where: { id: Number(postId) },
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.json({ likes: post.likes });
        return;
    } catch (error) {
        console.error("Error fetching likes count:", error);
        res.status(500).json({ message: "Error fetching likes count" });
        return;
    }
});

export { toggleLikeControler, getLikesCountController };
