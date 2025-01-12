import React, { useContext, useEffect, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import '../../assets/styles/leftsidebar.css';
import { PlantCareContext, PlantCareContextProps } from '../../context';

const LeftSidebar: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);
  const { user } = useContext(PlantCareContext) as PlantCareContextProps;


  useEffect(() => {
    fetch('http://localhost:3000/api/v1/users')
      .then((response) => response.json())
      .then((data) => setOnlineUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleConnectClick = (username: string) => {
    alert(`Connect with ${username}`); 
    
  };
  

  return (
    <div className="left-sidebar">
     
      <div className="user-profile">
      <img
            src={`http://localhost:3000/${user?.profilePhoto || 'uploads/default-placeholder.png'}`}
            alt={user?.name || 'User Avatar'}
            className="user-avatar"
            onError={(e) => {
    e.currentTarget.src = 'https://via.placeholder.com/100';
  }}
/>

            
        <h3>{user?.name}</h3>
          </div>
        

      {/* Online Users Section */}
      <div className="online-users">
        <h4>Users you might share the same plant with</h4>
        <ul>
          {Array.isArray(onlineUsers)? onlineUsers.slice(0, showMore ? onlineUsers.length : 2).map((user: any) => (
            <li key={user.id} className="user-item">
              <img
                      src={`http://localhost:3000/${user?.profilePhoto || 'uploads/default-placeholder.png'}`}
                      alt={user.name}
                      className="user-avatar-small"
                      onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100';
                      }}
              />
              <span>{user.name}</span>
              <button onClick={() => handleConnectClick(user.name)}>
                <FaUserPlus />
                Connect
              </button>
            </li>
          )):(<p>"not an array"</p>)}
        </ul>
        {/* Show More Button */}
        {!showMore && onlineUsers.length > 5 && (
          <button onClick={() => setShowMore(true)}>More</button>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
