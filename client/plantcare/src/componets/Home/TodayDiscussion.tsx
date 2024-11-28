import React from "react";
import { useNavigate } from "react-router-dom";

const TodayDiscussion: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="discussion">
      <div className="discussion-card">
        <div className="card-column">
        <h3>Visualize Plants</h3>
          <p>Experience AR plant visualization!</p>
        </div>
        <button className="action-button" onClick={() => navigate("/plants")}>Try AR</button>
      </div>
      <div className="discussion-card">
        <div className="dis-card">
        <h3>Care Guide</h3>
          <p>A comprehensive guide to plant care</p>
        </div>
        <button className="action-button" onClick={() => navigate("/care-tips")}>Explore</button>
      </div>
    </section>
  );
};

export default TodayDiscussion;
