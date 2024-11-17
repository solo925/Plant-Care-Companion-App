import React, { useState } from 'react';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { postTypes } from '../../Types';
import '../../assets/styles/blogpostcard.css';

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
      {/* Author Profile */}
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
          <h4>{post.author.name}|<span className='post-date'>{new Date(post.createdAt).toLocaleDateString()}</span></h4>
          <p>@{post.author.name}</p>
        </div>
      </div>

      {/* Post Content */}
      <h3 className="post-title">{post.title}</h3>
      {/* <p className="post-meta">by {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p> */}
      <p className="post-content">{post.content}</p>
      <a className="read-more-link" href={`/posts/${post.id}`}>Read More</a>

      {/* Bottom Section: Likes and Comments */}
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
