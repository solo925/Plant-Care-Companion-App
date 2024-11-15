import { useNavigate } from 'react-router-dom';
import { roomTypes } from '../../Types';

interface ChatRoomListProps {
    rooms: roomTypes[]; 
    onRoomSelect: (roomId: number ) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms, onRoomSelect }) => {
    const navigate = useNavigate();

    return (
        <div>
           <h2>Join a Chat Room</h2>
<ul>
    {rooms && rooms.length > 0 ? (
        rooms.map((room) => (
            <li
                key={room.id}
                onClick={() => {
                    if (room.id !== undefined) { 
                        onRoomSelect(room.id);
                        navigate(`rooms/${room.id}`);
                    } else {
                        console.error('Room ID is undefined');
                    }
                }}
            >
                <h3>{room.name || 'Unnamed Room'}</h3>
                <p>{room.description || 'No description available'}</p>
            </li>
        ))
    ) : (
        <p>No rooms available</p>
    )}
</ul>

        </div>
    );
};

export default ChatRoomList;
