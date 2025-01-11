import { Queue, Worker } from 'bull';
import { AppDataSource } from '../config/data-source';
import { Post } from '../models/Post';


// Create a queue for processing post interactions
const postQueue = new Queue('postQueue', {
    redis: { host: 'localhost', port: 6379 },
});

postQueue.process(async (job) => {
    const { postId, action, userId } = job.data;

    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: postId }, relations: ['likedBy'] });

    if (post) {
        if (action === 'like') {
            const userHasLiked = post.likedBy.some(user => user.id === userId);
            if (userHasLiked) {
                post.likes--;
                post.likedBy = post.likedBy.filter(user => user.id !== userId);
            } else {
                post.likes++;
                post.likedBy.push({ id: userId } as any);
            }
            await postRepository.save(post);
        }

        // Add more actions like comment processing here
    }
});

// Add tasks to the queue in your controllers
async function addPostActionToQueue(postId: number, action: string, userId: string) {
    await postQueue.add({ postId, action, userId });
}
