import { roomTypes } from "../../Types";

interface ChatRoomListProps {
    rooms?: roomTypes[] | undefined;
    onRoomSelect?: (roomId: number) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms, onRoomSelect }) => {
    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Chat Rooms</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {rooms && rooms.length > 0 ? (
                    rooms.map((room) => (
                        <li
                            key={room.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            onClick={() => {
                                if (onRoomSelect && room.id !== undefined) {
                                    onRoomSelect(room.id);
                                }
                            }}
                        >
                            <div style={{ marginLeft: '0.5rem' }}>
                                <h3 style={{ margin: '0', fontSize: '1rem' }}>{room.name || 'Unnamed Room'}</h3>
                                <p style={{ margin: '0', color: '#6b6b6b', fontSize: '0.8rem' }}>
                                    {room.description || ''}
                                </p>
                            </div>
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
