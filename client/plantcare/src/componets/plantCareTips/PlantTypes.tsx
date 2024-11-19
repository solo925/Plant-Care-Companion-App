import React from "react";

const PlantTypes: React.FC = () => {
  const types = ["Dise", "Pr", "Soil", "Lighting", "Temp"];

  return (
    <section className="plant-types">
      <h2>Plant Types</h2>
      <div className="checkbox-group">
        {types.map((type, index) => (
          <label key={index}>
            <input type="checkbox" />
            {type}
          </label>
        ))}
      </div>
    </section>
  );
};

export default PlantTypes;
