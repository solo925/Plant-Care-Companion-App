import { useContext, useEffect } from 'react';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import BlogPostCard from './BlogPostCard';

const BlogPostList = () => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { posts = [], setPosts } = context || {};

    useEffect(() => {
        if (!posts.length) {
            fetch('http://localhost:3000/api/v1/post')
                .then(response => response.json())
                .then(data => setPosts(data))
                .catch(error => console.error('Error loading posts:', error));
        }
    }, [posts, setPosts]);

    
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div>
            <div className="post-list">
                {sortedPosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default BlogPostList;
