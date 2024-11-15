import { useContext, useEffect, useState } from 'react';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { postTypes } from '../../Types';
import BlogPostCard from './BlogPostCard';

interface filterType extends postTypes{
    category?: string
}

const BlogPostList = () => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { posts =[], setPosts } = context || {};
    const [filteredPosts, setFilteredPosts] = useState<filterType[]>(posts);

    useEffect(() => {
        if (!posts.length) {
            fetch('http://localhost:3000/api/v1/post')
                .then(response => response.json())
                .then(data => setPosts(data))
                .catch(error => console.error('Error loading posts:', error));
        }
    }, [posts, setPosts]);

    const filterByCategory= (category: string) => {
        setFilteredPosts(posts.filter((post: filterType) => post.category === category));
    };

    return (
        <div>
            <h2>Community Forum - Blog</h2>
            {/* Category Filter */}
            <div>
                <button onClick={() => setFilteredPosts(posts)}>All</button>
                <button onClick={() => filterByCategory('Indoor')}>Indoor Plants</button>
                <button onClick={() => filterByCategory('Outdoor')}>Outdoor Plants</button>
            </div>
            <div className="post-list">
                {filteredPosts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default BlogPostList;