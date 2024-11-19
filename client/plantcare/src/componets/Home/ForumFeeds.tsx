// components/ForumFeed.tsx
import React from "react";

const ForumFeed: React.FC = () => {
  return (
    <section className="forum-feed">
      <div className="quiz-section">
        <h3>Daily plant quiz challenge!</h3>
        <button className="quiz-button">Start</button>
      </div>
      <div className="contributors">
        <h4>Top Contributors</h4>
        <ul>
          <li>#201 Roots - Healthy</li>
          <li>#202 Plant - Community</li>
          <li>#203 Botanical - Plant</li>
          <li>#207 Plant - Plant</li>
        </ul>
      </div>
    </section>
  );
};

export default ForumFeed;
