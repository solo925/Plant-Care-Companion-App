import React from "react";

const HumidityLevels: React.FC = () => {
  return (
    <section className="humidity-levels">
      <h2>Humidity Levels</h2>
      <div className="humidity-icons">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <span key={index} className="icon">💧</span>
          ))}
      </div>
    </section>
  );
};

export default HumidityLevels;
