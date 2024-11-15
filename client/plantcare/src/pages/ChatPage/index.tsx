import { useContext, useState } from 'react';
import ChatRoomList from '../../componets/CommunicationForum/ChatRoomList';
import ChatRoomView from '../../componets/CommunicationForum/ChatRoomView';
import PrivateMessage from '../../componets/CommunicationForum/PrivateMessage';
import { PlantCareContext, PlantCareContextProps } from '../../context';

const ChatPage = () => {
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { rooms } = context || {};
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    const handleRoomSelect = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    return (
        <div className="chat-page">
            <ChatRoomList rooms={rooms || []} onRoomSelect={handleRoomSelect} />
            <ChatRoomView roomId={selectedRoomId} />
            <PrivateMessage />
        </div>
    );
};

export default ChatPage;
