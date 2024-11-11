import React from 'react';

interface PlantCardProps {
  imageSrc: string;
  name: string;
  description: string;
}

const PlantCard: React.FC<PlantCardProps> = ({ imageSrc, name, description }) => {
  return (
    <div className="card">
      <img src={imageSrc} alt={name} />
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="card-footer">
        <a href="/learn-more">Learn More</a>
        <a href="/care-tips">Care Tips</a>
      </div>
    </div>
  );
};

export default PlantCard;
