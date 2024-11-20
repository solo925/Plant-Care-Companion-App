import React from "react";

const PlantHealth: React.FC = () => {
  const levels = ["Novice", "Intermediate", "Expert"];

  return (
    <section className="plant-health">
      <h2>Plant Health</h2>
      <div className="checkbox-group">
        {levels.map((level, index) => (
          <label key={index}>
            <input type="checkbox" />
            {level}
          </label>
        ))}
      </div>
    </section>
  );
};

export default PlantHealth;
