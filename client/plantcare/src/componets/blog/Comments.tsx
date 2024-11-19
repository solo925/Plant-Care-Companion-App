import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { commentTypes } from '../../Types';

interface CommentsProps {
  postId?: number;
  comment?: commentTypes;
}

const Comments: React.FC<CommentsProps> = ({ postId,comment}) => {
  const [comments, setComments] = useState<commentTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/comments/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  return (
    <div className="comments-section">
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-author">
              <FaUserCircle className="profile-pic" />
              <p>{comment.author.name}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
            <p>{comment.content}</p>
            {comment.image && (
              <img
                src={`http://localhost:3000/${comment.image}`}
                alt="comment-img"
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
