import { Queue, Worker } from 'bullmq';
import { AppDataSource } from '../config/data-source';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';

const postQueue = new Queue('postQueue', {
  connection: {
    host: 'localhost',
    port: 6379,
    retryStrategy: (times) => {
      if (times > 10) {
        return undefined;
      }
      return Math.min(times * 50, 2000);
    },
  },
});

const postWorker = new Worker('postQueue', async (job) => {
  const { postId, action, userId, content } = job.data;


  if (action === 'comment' && content) {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (post) {
      const commentRepository = AppDataSource.getRepository(Comment);

     
      const newComment = commentRepository.create({
        content: content as string, 
        post: { id: postId },       
        author: { id: userId },    
      });

      await commentRepository.save(newComment); 
    }
  } else if (action === 'like') {
    const postRepository = AppDataSource.getRepository(Post);
    const post = await postRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (post) {
      const userHasLiked = post.likedBy.some((user) => user.id === userId);
      if (userHasLiked) {
        post.likes--;
        post.likedBy = post.likedBy.filter((user) => user.id !== userId);
      } else {
        post.likes++;
        post.likedBy.push({ id: userId } as any);
      }
      await postRepository.save(post);
    }
  }
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

export async function addPostActionToQueue(
  postId: number,
  action: string,
  userId: string,
  content?: string 
) {
  
  await postQueue.add('postAction', { postId, action, userId, content });
}
