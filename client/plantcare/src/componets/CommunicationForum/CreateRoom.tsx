import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [inviteEmails, setInviteEmails] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (roomName && roomDescription) {
            const roomData = {
                name: roomName,
                description: roomDescription,
                inviteEmails: inviteEmails.split(',').map(email => email.trim()),
            };

            
            fetch('http://localhost:3000/api/v1/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData),
            })
            .then(response => response.json())
            .then(data => {
                
                // navigate(`rooms/${data.id}`);
                navigate(`/chat`);
            })
            .catch(error => console.error('Error creating room:', error));
        }
    };

    return (
        <div>
            <h2>Create a New Chat Room</h2>
            <input
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <textarea
                placeholder="Room Description"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Invite Emails (comma separated)"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default CreateRoom;
