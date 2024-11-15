import { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlantCareContext } from '../../context';
import { userTypes } from '../../Types';

const NewPost = () => {
    const { user } = useContext<userTypes | any>(PlantCareContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:3000/api/v1/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, content, author: user.name }),
        });
        const data = await response.json();
        console.log('Post created:', data);
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
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            <button onClick={handleSubmit}>Post</button>
        </div>
    );
};

export default NewPost;