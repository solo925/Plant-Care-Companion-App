import React, { useContext, useEffect, useState } from 'react';
import { FaCommentAlt, FaRetweet, FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../assets/styles/blogpostcard.css';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { postTypes } from '../../Types';
import formatTimeAgo from '../../Utils';

interface BlogPostCardProps {
  post: postTypes;
  currentUserPhoto?: string; 
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, currentUserPhoto }) => {
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);  // Initialize comments as an empty array
  const context = useContext(PlantCareContext) as PlantCareContextProps;
  const { user } = context || {};

  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/comments/${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []); 
        } else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id]); 

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = () => {
    alert('Repost functionality coming soon!');
  };

  const handleCommentKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && comment.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/comments/${post.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            content: comment,  
          }),
        });

        if (response.ok) {
          const savedComment = await response.json();
          setComments((prev) => [...prev, savedComment.comment]); 
          setComment('');  
        } else {
          console.error('Failed to submit comment:', response.statusText);
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  return (
    <div className="blog-post-card">
      <div className="author-profile">
        <img
          src={`http://localhost:3000/${post.author.profilePhoto || 'uploads/default-placeholder.png'}`}
          alt={post.author.name}
          className="author-avatar"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/100';
          }}
        />
        <div className="author-info">
          <h4>
            {post.author.name} <span className="dot">.</span>
            <span className="post-date">{formatTimeAgo(new Date(post.createdAt))}</span>
          </h4>
        </div>
      </div>

      <h3 className="post-title">{post.title}</h3>

      {post.imageUrl && (
        <div className="post-image-container">
          <img
            src={`http://localhost:3000/${post.imageUrl}`}
            alt={post.title}
            className="post-image"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300';
            }}
          />
        </div>
      )}

      <p className="post-content">{post.content}</p>
      <Link to={`/post/${post.id}`} className="read-more-link">
        Read More
      </Link>

      
      <div className="post-actions">
        <div className="like-section" onClick={toggleLike}>
          <FaThumbsUp className={`like-icon ${liked ? 'liked' : ''}`} />
          <span>{likes} Likes</span>
        </div>
        <div className="repost-section" onClick={handleRepost}>
          <FaRetweet className="repost-icon" />
          <span>Repost</span>
        </div>
        <div className="comment-section">
          <FaCommentAlt className="comment-icon" />
          <span>{comments?.length || 0} Comments</span> 
        </div>
      </div>

     
      <div className="comment-input-section">
        <img
          src={`http://localhost:3000/${ user?.profilePhoto || 'uploads/default-placeholder.png'}`}
          alt="Current User"
          className="current-user-avatar"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleCommentKeyPress}
          className="comment-input"
        />
      </div>
    </div>
  );
};

export default BlogPostCard;
