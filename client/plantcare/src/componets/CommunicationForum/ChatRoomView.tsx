import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { messageType } from '../../Types';

interface ChatRoomViewProps {
    roomId: number | null; 
}

const ChatRoomView: React.FC<ChatRoomViewProps> = () => {
    const { id } = useParams<{ id: string }>();
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { user, rooms, setRooms, messages, setMessages } = context || {};

    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Fetch room details
        fetch(`http://localhost:3000/api/v1/rooms/${id}`)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error loading room details:', error));

        const socketConnection = io('http://localhost:3000');
        setSocket(socketConnection);

        
        socketConnection.emit('joinRoom', id);

        
        socketConnection.on('message', (message: messageType) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketConnection.emit('leaveRoom', id);
            socketConnection.disconnect();
        };
    }, [id, setRooms, setMessages]);

    const handleSendMessage = () => {
        if (socket && newMessage) {
            const message: messageType = {
                content: newMessage,
                createdAt: new Date(),
                sender: user,
                recipient: { id },
            };
            socket.emit('sendMessage', message);
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
        }
    };

    return (
        <div>
          
            {rooms.length > 0 ? (
                <>
                    <h2>{rooms[0].name}</h2>
                    <p>{rooms[0].description}</p>
                    <div className="message-container">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <strong>{message.sender?.name || 'Anonymous'}</strong>: {message.content}{' '}
                                <span>{new Date(message.createdAt || '').toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </>
            ) : (
                <><p>No room selected or available. Create a new room below:</p><Link to="/create-room">
                        <button>Create Room</button>
                    </Link></>
                    
                    
            )}
        </div>
    );
}    
export default ChatRoomView;
