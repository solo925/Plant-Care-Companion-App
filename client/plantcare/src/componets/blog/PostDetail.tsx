import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postTypes } from '../../Types';
import Comments from './Comments';

const PostDetail: React.FC = () => {
    const params:any =  useParams();
    const { postId } = params || {};
  const [post, setPost] = useState<postTypes | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/post/${postId}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error('Failed to fetch post:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <div className="author-info">
        <p>By {post.author.name}</p>
        <p>{new Date(post.createdAt).toLocaleString()}</p>
      </div>
      {post.imageUrl && (
        <img
          src={`http://localhost:3000/${post.imageUrl}`}
          alt={post.title}
          className="post-detail-image"
        />
      )}
      <p>{post.content}</p>

      {/* Comments Section */}
      <Comments postId={parseInt(postId, 10)} />
    </div>
  );
};

export default PostDetail;
