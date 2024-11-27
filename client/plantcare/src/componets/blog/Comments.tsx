import React, { useEffect, useState } from 'react';
import { commentTypes } from '../../Types';
import '../../assets/styles/comments.css';

interface CommentsProps {
  postId?: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<commentTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/v1/comments/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !postId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments((prev) => [...prev, savedComment]); // Update state with new comment
        setNewComment(''); 
      } else {
        console.error('Failed to submit comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  return (
    <div className="comments-section">
      <div className="comment-input-section">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSubmitting}
          className="comment-input"
        />
      </div>

      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment-header">
              <img
                src={`http://localhost:3000/${c.author.profilePhoto || 'uploads/default-placeholder.png'}`}
                alt={c.author.name}
                className="author-avatar"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/100';
                }}
              />
              <div className="comment-author-info">
                <p className="author-name">{c.author.name}</p>
                <small className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
            <p className="comment-content">{c.content}</p>
            {c.image && (
              <img
                src={`http://localhost:3000/${c.image}`}
                alt="Comment"
                className="comment-image"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
