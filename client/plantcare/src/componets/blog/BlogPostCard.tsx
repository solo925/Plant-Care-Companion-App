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
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('content', commentText);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/comments/${post.id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error posting comment: ${await response.text()}`);
      }

      setCommentText('');
      setImage(null);
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
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
      <a className="read-more-link" href={`/posts/${post.id}`}>Read More</a>

      <div className="post-actions">
        <div className="like-section" onClick={toggleLike}>
          <FaThumbsUp className={`like-icon ${liked ? 'liked' : ''}`} />
          <span>{likes} Likes</span>
        </div>
        <div className="comment-section" onClick={toggleCommentForm}>
          <FaComment className="comment-icon" />
          <span>Comment</span>
        </div>
      </div>

      {/* Conditionally render the comment form */}
      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea 
            value={commentText} 
            onChange={handleCommentChange} 
            placeholder="Write a comment..." 
            required
          />
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Post Comment</button>
        </form>
      )}
    </div>
  );
};

export default BlogPostCard;
