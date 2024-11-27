import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

      <Link to="/dashboard" className="dashboard-link">
        <h2 className="dashboard-header">Visit your Dashboard</h2>
      </Link>
      


    </section>
  );
};

export default ForumFeed;
