import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { R } from '../../controllers/communicationForum/likesController';

// Initialize Redis client asynchronously
async function initializeRedisClient() {
    const redisClient = createClient({ url: 'redis://localhost:6379' });
    await redisClient.connect();
    return redisClient;
}

const redisClient = await initializeRedisClient(); // Ensure Redis client is initialized

const rateLimitMiddleware = async (req: R, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const postId = req.params.postId;
    const rateLimitKey = `rateLimit:${userId}:${postId}`;

    // Get the current request count for the user and post
    const requests = await redisClient.get(rateLimitKey);
    if (requests && parseInt(requests) > 5) {
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    // Increment the request count and set the expiration time (60 seconds)
    await redisClient.multi()
        .incr(rateLimitKey) // Increment the counter
        .expire(rateLimitKey, 60) 
        .exec(); 

    next();
};

export default rateLimitMiddleware;
