import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/MyPlantsPage.css';
import { PlantType } from '../../Types';


function MyPlantsPage() {
    const [ownedPlants, setOwnedPlants] = useState<PlantType[]>([]);
    const [myPlants, setMyPlants] = useState<PlantType[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnedPlants = async () => {
      const response = await fetch('http://localhost:3000/api/v1/plants/user/plants', {
          headers: {
            "content-type":'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  
        }
      });
      const data = await response.json();
      setOwnedPlants(data);
    };

    fetchOwnedPlants();
  }, []);

    
  const handleDisownPlant = async (plantId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/user/plants/${plantId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setMyPlants(myPlants.filter((plant) => plant!.id !== plantId));
      }
    } catch (error) {
      console.error('Error disowning plant:', error);
    }
  };

  const handleViewPlantCare = (plantId: string) => {
    navigate(`/care-reminder/${plantId}`);
  };

  return (
    <div className="my-plants-container">
      <h1>My Plants</h1>
      <div className="plants-grid">
        {ownedPlants.map((plant) => (
          <div key={plant.id} className="plant-card">
            <img src={plant.imageUrl} alt={plant.name} className="plant-card-image" />
            <h3>{plant.name}</h3>
            {
              plant.id && (
                <>
                <button onClick={() => handleViewPlantCare(plant.id!)}>View Care Reminder</button>
                <button onClick={() => handleDisownPlant(plant.id!)}>Disown Plant</button>
                </>
              )
            }
               
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPlantsPage;
