import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoomList from '../../componets/CommunicationForum/ChatRoomList';
import ChatRoomView from '../../componets/CommunicationForum/ChatRoomView';
import { PlantCareContext, PlantCareContextProps } from '../../context';

const ChatPage = () => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { rooms } = context || {};
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleRoomSelect = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    const handleCreateRoom = () => {
        navigate('/create-room');
    };

    return (
        <div className="chat-page" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Left Panel: Room List */}
            <div style={{ flex: '0.3', backgroundColor: '#e9f5db', overflowY: 'auto' }}>
                <button
                    onClick={handleCreateRoom}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        border: 'none',
                    }}
                >
                    +
                </button>
                <ChatRoomList rooms={rooms || []} onRoomSelect={handleRoomSelect} />
            </div>

            {/* Right Panel: Chat Room */}
            <div style={{ flex: '0.7', backgroundColor: '#f0fff4', display: 'flex', flexDirection: 'column' }}>
                <ChatRoomView roomId={selectedRoomId} />
            </div>
        </div>
    );
};

export default ChatPage;
