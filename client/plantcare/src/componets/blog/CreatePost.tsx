import { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlantCareContext } from '../../context';
import { userTypes } from '../../Types';


const NewPost = () => {
    const { user } = useContext<userTypes | any>(PlantCareContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('description', description);
        formData.append('author', user.name);
        
        if (image) {
            formData.append('imageUrl', image);
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/v1/post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`Failed to create post: ${errorText}`);
            }
    
            const data = await response.json(); 
            console.log('Post created:', data);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    
        setTitle('');
        setDescription('');
        setImage(null);
        setContent('');
        setShowEditor(false);
    };
    
    

    return (
        <div>
            <h2>Create a New Post</h2>
            <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Post Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) {
                        setImage(e.target.files[0]);
                    }
                }}
            />
            <button onClick={() => setShowEditor(!showEditor)}>
                {showEditor ? 'Cancel' : 'Create Post'}
            </button>
            {showEditor && (
                <div>
                    <ReactQuill theme="snow" value={content} onChange={setContent} />
                    <button onClick={handleSubmit}>Post</button>
                </div>
            )}
        </div>
    );
};

export default NewPost;
