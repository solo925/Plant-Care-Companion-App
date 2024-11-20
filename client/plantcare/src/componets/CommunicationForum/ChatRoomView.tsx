import { useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import '../../assets/styles/ChatRoomView.css';
import { PlantCareContext, PlantCareContextProps } from "../../context";
import { messageType } from "../../Types";

type ChatRoomViewProps = {
    roomId: number | null;
};


const socket = io("http://localhost:3000/api/v1", {
    transports: ["websocket"], 
   
});

const ChatRoomView: React.FC<ChatRoomViewProps> = ({ roomId }) => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { user, rooms } = context || {};
    const [messages, setMessages] = useState<messageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<messageType | null>(null);

    const fetchRoomMessages = async (roomId: number) => {
        const response = await fetch(`http://localhost:3000/api/v1/rooms/${roomId}/messages`);
        const messages = await response.json();
        setMessages(messages);
    };

    const handleSendMessage = () => {
        if (!user) {
            console.error("User is not defined. Unable to send message.");
            return;
        }
    
        if (newMessage.trim() || image) {
            const message: messageType = {
                content: newMessage,
                image: image ? URL.createObjectURL(image) : undefined,
                createdAt: new Date(),
                sender: user,
                replyTo: replyingTo ? replyingTo.content : null,
            };
    
            const updatedMessages = [...messages, message];
            setMessages(updatedMessages);
            localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    
            socket.emit("sendMessageToRoom", {
                roomId: roomId,
                message: newMessage,
                userId: user.id,
            });
    
            setNewMessage("");
            setImage(null);
            setReplyingTo(null);
        }
    };
    

    useEffect(() => {
        if (roomId) {
            fetchRoomMessages(roomId); 
        }
    }, [roomId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!roomId) {
        return <div className="chat-room-view-placeholder">Select a room to start chatting</div>;
    }

    return (
        <div className="chat-room-view">
            <div className="chat-header">{rooms?.find((room) => room.id === roomId)?.name}</div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender?.id === user?.id ? 'sent' : 'received'}`}
                    >
                        <div className="message-header">
                            <img
                                src={`http://localhost:3000/${message.sender?.profilePhoto || 'uploads/default-placeholder.png'}`}
                                alt="Avatar"
                                className="avatar"
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
                            {message.image && (
                                <img src={message.image} alt="Message Attachment" className="message-image" />
                            )}
                        </div>
                        <button
                            className="reply-button"
                            onClick={() => setNewMessage(`@${message.sender?.name}: ${message.content}`)}
                        >
                            Reply
                        </button>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <div className="message-input">
                {replyingTo && (
                    <div className="reply-context">
                        <strong>Replying to {replyingTo.sender?.name || 'Anonymous'}:</strong>
                        <p>{replyingTo.content}</p>
                        <button onClick={() => setReplyingTo(null)}>Cancel</button>
                    </div>
                )}
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-text-input"
                />
                <div className="message-actions">
                    <button onClick={handleSendMessage} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomView;
