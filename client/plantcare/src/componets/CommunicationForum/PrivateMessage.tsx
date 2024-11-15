import { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { messageType, userTypes } from '../../Types';

const PrivateMessage = ({ recipient }: { recipient?: userTypes }) => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { user, messages, setMessages } = context || {};

    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!user) {
            console.error("User is undefined. Cannot establish private chat.");
            return;
        }

        const socketConnection = io('http://localhost:3000', { transports: ['websocket', 'polling'] });
        setSocket(socketConnection);

       
        if (recipient) {
            socketConnection.emit('joinPrivateRoom', { sender: user.name, recipient });
        }

        socketConnection.on('privateMessage', (message: messageType) => {
            setMessages((prevMessages: messageType[]) => [...prevMessages, message]);
        });

        return () => {
            if (recipient) {
                socketConnection.emit('leavePrivateRoom', { sender: user.name, recipient });
            }
            socketConnection.disconnect();
        };
    }, [user, recipient]);

    const handleSendPrivateMessage = () => {
        if (socket && newMessage && user) {
            const message: messageType = {
                sender: user,
                content: newMessage,
                createdAt: new Date(),
            };
            socket.emit('sendPrivateMessage', { recipient, message });
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
        }
    };

    if (!user) {
        return <div>Loading user information...</div>;
    }

    if (!recipient) {
        return <div>Select a recipient to start a private chat.</div>;
    }

    return (
        <div>
            <h2>Private Chat with {recipient.name}</h2>
            <div className="private-message-container">
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender?.name || 'Anonymous'}</strong>: {message.content}{' '}
                        <span>{new Date(message.createdAt!).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>
            <div className="private-message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a private message..."
                />
                <button onClick={handleSendPrivateMessage}>Send</button>
            </div>
        </div>
    );
};

export default PrivateMessage;
