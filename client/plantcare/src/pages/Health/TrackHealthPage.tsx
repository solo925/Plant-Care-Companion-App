import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/TrackHealthPage.css';
import { PlantCareContext, PlantCareContextProps } from '../../context';
import { PlantType } from '../../Types';

function TrackHealthPage() {
    const { plantId } = useParams<{ plantId: string }>(); 
    const navigate = useNavigate();
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { plants, fetchPlants, loading } = context || {};

    const [healthPercentage, setHealthPercentage] = useState<number | null>(null);
    const [leafImage, setLeafImage] = useState<File | null>(null);

    useEffect(() => {
        if (!plants || plants.length === 0) {
            fetchPlants(); 
        }
    }, [plants, fetchPlants]);

    if (loading || !plants || plants.length === 0) {
        return <h2>Loading plant details...</h2>;
    }

   
    const plant = plants.find((plant: PlantType) => plant.id === parseInt(plantId!, 10));

    if (!plant) {
        return <h2>Plant not found</h2>;
    }

    const handleHealthUpload = async () => {
        if (!leafImage) {
            alert('Please upload a leaf image to gauge health!');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('file', leafImage);
    
            const response = await fetch('https://api-inference.huggingface.co/models/username/plant-disease-model', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer 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`, 
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                setHealthPercentage(data.healthPercentage || 0); 
            } else {
                alert('Failed to process the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading leaf image:', error);
            alert('An error occurred while processing the image.');
        }
    };
    

    return (
        <div className="track-health-page">
            <div className="sidebar">
                <h2>Plant Details</h2>
                <img src={plant.imageUrl} alt={plant.name} className="plant-image" />
                <h3>{plant.name}</h3>
                <p>{`Description: ${plant.description || 'No description available.'}`}</p>
                <p>{`Last Watered: ${plant.lastWatered || 'Not recorded.'}`}</p>
                <p>{`Growth Stage: ${plant.growthStage || 'Unknown'}`}</p>
            </div>

            <div className="content">
                <h1>Track Health for {plant.name}</h1>
                <div className="health-section">
                    {healthPercentage !== null ? (
                        <h2 style={{ color: healthPercentage > 60 ? 'green' : 'red' }}>
                            Health Percentage: {healthPercentage}%
                        </h2>
                    ) : (
                        <p>Upload a leaf image to gauge health.</p>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLeafImage(e.target.files?.[0] || null)}
                    />
                    <button onClick={handleHealthUpload}>Upload & Check Health</button>
                </div>

                <div className="care-section">
                    <h2>Keep {plant.name} healthier</h2>
                    <p>Ensure optimal watering, sunlight, and soil conditions for your plant.</p>
                </div>

                <div className="explore-section">
                    <h2>Explore Care Tips</h2>
                    <p>Check out video tutorials and detailed guides to improve your plant care knowledge.</p>
                    <button onClick={() => navigate('/care-tips')}>Go to Care Tips</button>
                </div>
            </div>
        </div>
    );
}

export default TrackHealthPage;
