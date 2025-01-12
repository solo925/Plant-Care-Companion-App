import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Post } from "../../models/Post";
import express from 'express';
import { verifyToken } from "../../middlewares/Authmidlewares/IsAuthenticated";
import { AppDataSource } from "../../config/data-source";
import rateLimitMiddleware from "../../middlewares/rate_limiter/rateLimiter";
import { addPostActionToQueue } from "../../bull/job_Queue_for_post";
import { initializeRedisClient } from "../../redis/redisCaching";  

const toggleLikeControler = express.Router();
const getLikesCountController = express.Router();

export interface R extends Request {
  user?: {
    id?: string;
  };
}

toggleLikeControler.post('/:postId/like', verifyToken, async (req: R, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const redisClient = await initializeRedisClient();
    let post = await redisClient.getCachedPost(Number(postId));
    
    if (!post) {
      const postRepository = AppDataSource.getRepository(Post);
      post = await postRepository.findOne({ where: { id: Number(postId) }, relations: ['likedBy'] });
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      await redisClient.cachePopularPost(Number(postId), post);
    }

    const cachedLikes = await redisClient.getCachedLikesCount(Number(postId));
    if (cachedLikes !== null) {
      post.likes = cachedLikes;
    }

    await rateLimitMiddleware(req, res, () => {});
    await addPostActionToQueue(Number(postId), 'like', userId!);

    res.json({ likes: post.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like" });
  }
});

getLikesCountController.get("/:postId/likes", verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;

  try {
    
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: Number(postId) } });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({ likes: post.likes });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    res.status(500).json({ message: "Error fetching likes count" });
  }
});

export { toggleLikeControler, getLikesCountController };
