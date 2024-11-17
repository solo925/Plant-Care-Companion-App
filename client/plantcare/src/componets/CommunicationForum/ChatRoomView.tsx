import { useContext, useEffect, useRef, useState } from "react";
import '../../assets/styles/ChatRoomView.css';
import { PlantCareContext, PlantCareContextProps } from "../../context";
import { messageType } from "../../Types";

type ChatRoomViewProps = {
    roomId: number | null;
}

const ChatRoomView: React.FC<ChatRoomViewProps> = ({ roomId }) => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { user, rooms } = context || {};
    const [messages, setMessages] = useState<messageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [image, setImage] = useState<File | null>(null); 
    const messageEndRef = useRef<HTMLDivElement>(null);

    
    const handleSendMessage = () => {
        if (newMessage.trim() || image) {
            const message: messageType = {
                content: newMessage,
                image: image ? URL.createObjectURL(image) : undefined,
                createdAt: new Date(),
                sender: user,
            };

            const updatedMessages = [...messages, message];
            setMessages(updatedMessages);
            localStorage.setItem('chatMessages', JSON.stringify(updatedMessages)); // Save to localStorage
            setNewMessage('');
            setImage(null); // Reset image after sending
        }
    };

    // Load messages from localStorage on component mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages)); // Load saved messages
        }
    }, []);

    // Auto-scroll to the latest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const selectedRoom = rooms?.find((room) => room.id === roomId);

    if (!roomId || !selectedRoom) {
        return <div className="chat-room-view-placeholder">Select a room to start chatting</div>;
    }

    return (
        <div className="chat-room-view">
            {/* Chat Header */}
            <div className="chat-header">
                {selectedRoom.name}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender?.id === user?.id ? 'sent' : 'received'}`}>
                        <div className="message-header">
                            <img
                                src={`http://localhost:3000/${message.sender?.profilePhoto || 'uploads/default-placeholder.png'}`}
                                alt="Avatar"
                                className="avatar"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/100';
                                }}
                            />
                            <div className="message-info">
                                <strong>{message.sender?.name || 'Anonymous'}</strong>
                                <span className="message-time">
                                    {new Date(message.createdAt || '').toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                        <div className="message-body">
                            <p>{message.content}</p>
                            {message.image && <img src={message.image} alt="Message Attachment" className="message-image" />}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-text-input"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    className="image-input"
                />
                <button onClick={handleSendMessage} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoomView;
