import React, { useState } from 'react';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import '../../assets/styles/blogpostcard.css';
import { postTypes } from '../../Types';
import formatTimeAgo from '../../Utils';

interface BlogPostCardProps {
  post: postTypes;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const [likes, setLikes] = useState<number>(post.likes || 0);  
  const [liked, setLiked] = useState<boolean>(false);  

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
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
      <a className="read-more-link" href={`/posts/${post.id}`}>Read More</a>

      <div className="post-actions">
        <div className="like-section" onClick={toggleLike}>
          <FaThumbsUp className={`like-icon ${liked ? 'liked' : ''}`} />
          <span>{likes} Likes</span>
        </div>
        <div className="comment-section">
          <FaComment className="comment-icon" />
          <span>Comment</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
