import React from "react";
import { useNavigate } from "react-router-dom";
import mira from '../../assets/mira.jpg';

const ForumFeed: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigateToplnats = () => {
    navigate('/plants')
    
  }
  return (
    <section className="forum-feed">
      <div className="forum-card1">
        <h2>Comprehensive plants Database</h2>
        <div className="image-container">
          <img src={mira} alt="plants" />
        </div>
        <button onClick={handleNavigateToplnats}>Explore</button>
      </div>


    </section>
  );
};

export default ForumFeed;
