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

    const postRepository = AppDataSource.getRepository(Post);
    const userRepository = AppDataSource.getRepository(User);

    try {
        const post = await postRepository.findOne({
            where: { id: Number(postId) }, 
            relations: ["likedBy"], 
        });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const alreadyLiked = post.likedBy.some((u) => u.id === user.id);

        if (alreadyLiked) {
            
            post.likedBy = post.likedBy.filter((u) => u.id !== user.id);
            post.likes = Math.max(0, post.likes - 1);
        } else {
           
            post.likedBy.push(user);
            post.likes += 1;
        }

        await postRepository.save(post);

        res.json({ likes: post.likes });
        return;
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like" });
        return;
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
