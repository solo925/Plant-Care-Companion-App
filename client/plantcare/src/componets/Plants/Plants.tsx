import { useContext, useEffect } from 'react';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import PlantTile from './PlantTile';

function Plants() {
  const context = useContext(PlantCareContext) as PlantCareContextProps;
  const { plants,  loading,fetchPlants } = context || {};



  useEffect(() => {
    if (!plants || plants.length === 0) {
      fetchPlants();
    }
  }, [plants, fetchPlants]);

  
  if (loading || !plants || plants.length === 0) {
    return <h2>Loading plants...</h2>;
  }

 

  return (
    <div>
      <h2>Plants Datababse</h2>
      {plants && plants.length > 0 ? (
        plants.map((plant) => <PlantTile key={plant.id} singlePlantsTile={plant} />)
      ) : (
        <h2>No plants found</h2>
      )}
    </div>
  );
}

export default Plants;
