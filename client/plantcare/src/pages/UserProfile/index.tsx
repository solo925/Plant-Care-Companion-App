import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/profile1.css';
import UserProfileCard from '../../componets/Dashboard/UserProfileCard';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({ name: '', email: '', profilePhoto: null as File | null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/profile', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          profilePhoto: null,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (formData.profilePhoto) {
      form.append('profilePhoto', formData.profilePhoto);
    }

    try {
      const response = await axios.put('http://localhost:3000/api/v1/profile', form, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setUser(response.data);
      setIsEditing(false); 
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3000/api/v1/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      alert('Account deleted successfully');
      navigate('/login'); 
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h1>User Profile</h1>
      </div>

      <div className="user-profile-content">
        <UserProfileCard user={user} />

        {isEditing ? (
          <div className="profile-edit-form">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.profilePhoto && (
                <img
                  src={URL.createObjectURL(formData.profilePhoto)}
                  alt="Profile Preview"
                  className="profile-photo-preview"
                />
              )}
            </div>
            <button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-edit">
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile-actions">
            <button onClick={() => setIsEditing(true)} className="edit-profile-button">
              <FaPen /> Edit Profile
            </button>
            <button onClick={handleDeleteAccount} className="delete-account-button">
              <FaTrashAlt /> Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
