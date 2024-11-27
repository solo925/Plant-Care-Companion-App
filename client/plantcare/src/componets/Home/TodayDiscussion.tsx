import React from "react";

const TodayDiscussion: React.FC = () => {
  return (
    <section className="discussion">
      <div className="discussion-card">
        <div className="card-column">
        <h3>Visualize Plants</h3>
          <p>Experience AR plant visualization!</p>
        </div>
        <button className="action-button">Try AR</button>
      </div>
      <div className="discussion-card">
        <div className="dis-card">
        <h3>Care Guide</h3>
          <p>A comprehensive guide to plant care</p>
        </div>
        <button className="action-button">Explore</button>
      </div>
    </section>
  );
};

export default TodayDiscussion;
