import { useContext, useEffect } from 'react';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import BlogPostCard from './BlogPostCard';


const BlogPostList = () => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { posts =[], setPosts } = context || {};


    useEffect(() => {
        if (!posts.length) {
            fetch('http://localhost:3000/api/v1/post')
                .then(response => response.json())
                .then(data => setPosts(data))
                .catch(error => console.error('Error loading posts:', error));
        }
    }, [posts, setPosts]);

    // const filterByCategory= (category: string) => {
    //     setFilteredPosts(posts.filter((post: filterType) => post.category === category) || 'posts');
    // };

    return (
        <div>
            {/* <h2>Community Forum</h2> */}
           
            {/* <div>
                <button onClick={() => setFilteredPosts(posts)}>All</button>
                <button onClick={() => filterByCategory('Indoor')}>Indoor Plants</button>
                <button onClick={() => filterByCategory('Outdoor')}>Outdoor Plants</button>
            </div> */}
            <div className="post-list">
                {posts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default BlogPostList;