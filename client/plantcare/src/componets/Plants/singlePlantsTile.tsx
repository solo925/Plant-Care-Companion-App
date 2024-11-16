import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/singlePlantsTile.css';
import { PlantCareContext, PlantCareContextProps } from '../../context';

function SinglePlantTile() {
  const { id } = useParams<{ id: string }>();
  const context = useContext(PlantCareContext) as PlantCareContextProps;
  const { plants, fetchPlants, loading } = context || {};

  useEffect(() => {
    if (!plants || plants.length === 0) {
      fetchPlants();
    }
  }, [plants, fetchPlants]);

  if (loading || !plants || plants.length === 0) {
    return <h2>Loading plant details...</h2>;
  }

  const plantId = parseInt(id!, 10);
  const plant = plants.find((plant) => plant.id === plantId);

  if (!plant) {
    return <h2>Plant not found</h2>;
  }

  return (
    <div className="single-plant-container">
      <img src={plant.imageUrl} alt={plant.name} className="single-plant-image" />
      <div className="single-plant-details">
        <h2>{plant.name}</h2>
        <p>{plant.description}</p>
        <p><strong>Watering Frequency:</strong> {plant.wateringFrequency}</p>
        <p><strong>Growing Conditions:</strong> {plant.wateringFrequency}</p>
      </div>
    </div>
  );
}

export default SinglePlantTile;
