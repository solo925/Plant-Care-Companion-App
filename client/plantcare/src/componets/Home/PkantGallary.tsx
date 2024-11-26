import React from "react";
import mira from '../../assets/mira.jpg';
import pla2 from '../../assets/pla2.jpg';
import pla3 from '../../assets/pla3.jpg';
import pla from '../../assets/pla4.jpg';
import las from '../../assets/plant2.webp';

const PlantGallery: React.FC = () => {
  return (
    <section className="plant-gallery">
      <h2 className="section-title">Plant Gallery</h2>
      <div className="images">
        <img src={mira} alt="Plant 1" />
        <img src={pla2} alt="Plant 2" />
        <img src={pla3} alt="Plant 3" />
        <img src={pla} alt="Plant 4" />
        <img src={las} alt="Plant 5" />

      </div>
      
    </section>
  );
};

export default PlantGallery;
