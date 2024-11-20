import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { commentTypes, postTypes } from "../../Types";
import Comment from "./Comments";

const SinglePost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<postTypes | null>(null);
  const [comments, setComments] = useState<commentTypes[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/post/${postId}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error("Error fetching post:", error));

    fetch(`http://localhost:3000/api/v1/comments/${postId}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error("Error fetching comments:", error));
  }, [postId]);

  return post ? (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div>
        <h3>Comments</h3>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default SinglePost