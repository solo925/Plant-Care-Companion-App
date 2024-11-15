import React from "react";
import { commentTypes } from "../../Types";

const Comment: React.FC<{ comment: commentTypes }> = ({ comment }) => {
  return (
    <div className="comment">
      <p>{comment.content}</p>
      <small>By {comment.author.name} | {comment.createdAt.toLocaleString()}</small>
    </div>
  );
};
export default Comment;