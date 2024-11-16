import { useNavigate } from 'react-router-dom';
import { PlantType } from '../../Types';
import '../../assets/styles/PlantsTile.css';

interface SinglePlantProps {
  singlePlantsTile?: PlantType;
}

function PlantsTile({ singlePlantsTile }: SinglePlantProps) {
  const navigate = useNavigate();

  const handleNavigateToSinglePlant = (getPlantId: string | undefined) => {
    navigate(`/plants/${getPlantId}`);
  };

  return (
    <div className="plant-card">
      <img 
        src={singlePlantsTile?.imageUrl} 
        alt={singlePlantsTile?.name} 
        className="plant-card-image" 
      />
      <h3 className="plant-card-title">{singlePlantsTile?.name}</h3>
      <p className="plant-card-description">
        {singlePlantsTile?.description!.slice(0, 100)}...
      </p>
      <button 
        className="view-details-button"
        onClick={() =>
          singlePlantsTile !== undefined
            ? handleNavigateToSinglePlant(singlePlantsTile.id)
            : ''
        }
      >
        View Details
      </button>
    </div>
  );
}

export default PlantsTile;
