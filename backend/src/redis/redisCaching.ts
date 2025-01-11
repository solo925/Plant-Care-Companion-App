import { createClient } from 'redis';

async function initializeRedisClient() {
    const redisClient = createClient({ url: 'redis://localhost:6379' });
    await redisClient.connect();

  
    async function cachePopularPost(postId: number, data: any) {
        await redisClient.setEx(`post:${postId}`, 3600, JSON.stringify(data)); 
    }

    async function getCachedPost(postId: number) {
        const cachedPost = await redisClient.get(`post:${postId}`);
        if (cachedPost) {
            return JSON.parse(cachedPost);
        }
        return null;
    }

    async function cacheLikesCount(postId: number, likes: number) {
        await redisClient.setEx(`post:${postId}:likes`, 3600, likes.toString());
    }

    async function getCachedLikesCount(postId: number) {
        const cachedLikes = await redisClient.get(`post:${postId}:likes`);
        if (cachedLikes) {
            return parseInt(cachedLikes);
        }
        return null;
    }

    return { getCachedLikesCount, cacheLikesCount, getCachedPost, cachePopularPost };
}

export { initializeRedisClient };
