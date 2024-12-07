// components/PlantGallery.tsx
import React from "react";

const PlantGallery: React.FC = () => {
  return (
    <section className="plant-gallery">
      <h2 className="section-title">Plant Gallery</h2>
      <div className="images">
        <img src="https://via.placeholder.com/60" alt="Plant 1" />
        <img src="https://via.placeholder.com/60" alt="Plant 2" />
        <img src="https://via.placeholder.com/60" alt="Plant 3" />
        <img src="https://via.placeholder.com/60" alt="Plant 4" />
      </div>
      <button className="join-button">Join</button>
    </section>
  );
};

export default PlantGallery;
