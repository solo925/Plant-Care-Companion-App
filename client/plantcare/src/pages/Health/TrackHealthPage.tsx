// src/pages/TrackHealthPage.tsx
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/TrackHealthPage.css';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { PlantType } from '../../Types';

function TrackHealthPage() {
    const { plantId } = useParams<{ plantId: string }>(); // Get plantId from the URL
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { plants, fetchPlants, loading } = context || {};

    useEffect(() => {
        if (!plants || plants.length === 0) {
            fetchPlants(); // Fetch plants if not already loaded
        }
    }, [plants, fetchPlants]);

    if (loading || !plants || plants.length === 0) {
        return <h2>Loading plant details...</h2>;
    }

    // Convert `plantId` from string to number for comparison
    const plant = plants.find((plant: PlantType) => plant.id === parseInt(plantId!, 10));

    if (!plant) {
        return <h2>Plant not found</h2>;
    }

    return (
        <div className="track-health-page">
            <h1>Track Health for {plant.name}</h1>
            <div className="plant-details">
                <img src={plant.imageUrl} alt={plant.name} className="plant-image" />
                <h2>{plant.name}</h2>
                <p>{`Description: ${plant.description || 'No description available.'}`}</p>
                <p>{`Last Watered: ${plant.lastWatered || 'Not recorded.'}`}</p>
                <p>{`Growth Stage: ${plant.growthStage || 'Unknown'}`}</p>
            </div>
            <div className="track-health-actions">
                <button onClick={() => console.log('Record Health Update')}>Record Health Update</button>
                <button onClick={() => console.log('View Health History')}>View Health History</button>
            </div>
        </div>
    );
}

export default TrackHealthPage;
