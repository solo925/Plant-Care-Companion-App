import React from 'react';
import { postTypes } from '../../Types';

interface BlogPostCardProps {
    post: postTypes;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => (
    <div className="blog-post-card">
        <h3>{post.title}</h3>
        <p>by {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
        <p>{post.content}</p>
        <a href={`/community/posts/${post.id}`}>Read More</a>
    </div>
);

export default BlogPostCard;