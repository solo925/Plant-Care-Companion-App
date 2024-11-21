import React from "react";

interface UserProfileCardProps {
    user: {
        name: string;
        email: string;
        profilePhoto?: string;
    } | null;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
    return (
        <div className="user-profile-card">
            <div className="profile-header">
                <img
                    src={`http://localhost:3000/${user?.profilePhoto || 'uploads/default-placeholder.png'}`}
                    alt={user?.name || 'User Avatar'}
                    className="user-avatar"
                    onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/100';
                    }}
                />
            </div>
            <div className="profile-details">
                <h2>{user?.name || "Guest"}</h2>
                <p>{user?.email || "No email available"}</p>
            </div>
        </div>
    );
};

export default UserProfileCard;
