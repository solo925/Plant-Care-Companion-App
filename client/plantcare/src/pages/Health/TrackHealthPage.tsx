import * as tmImage from "@teachablemachine/image";
import dotenv from 'dotenv';
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../assets/styles/TrackHealthPage.css";
import { PlantCareContext, PlantCareContextProps } from "../../context";
import { PlantType } from "../../Types";

dotenv.config();

function TrackHealthPage() {
    const { plantId } = useParams<{ plantId: string }>();
    const navigate = useNavigate();
    const context = useContext(PlantCareContext) as PlantCareContextProps;
    const { plants, fetchPlants, loading,user } = context || {};

    const [healthStatus, setHealthStatus] = useState<string | null>(null);
    const [healthPercentage, setHealthPercentage] = useState<number | null>(null);
    const [leafImage, setLeafImage] = useState<File | null>(null);
    const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);

    const MODEL_URL = process.env.MODEL_URL;

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
            alert("Please upload a leaf image to gauge health!");
            return;
        }
    
        try {
            setLoadingPrediction(true);
            const modelURL = `${MODEL_URL}model.json`;
            const metadataURL = `${MODEL_URL}metadata.json`;
            const model = await tmImage.load(modelURL, metadataURL);
    
            const img = document.createElement("img");
            img.src = URL.createObjectURL(leafImage);
    
            img.onload = async () => {
                const predictions = await model.predict(img);
                const bestPrediction = predictions.reduce((prev, current) =>
                    prev.probability > current.probability ? prev : current
                );
    
                const healthStatus = bestPrediction.className;
                const healthPercentage = Math.round(bestPrediction.probability * 100);
    
                const possibleCauses = healthStatus === "Rusty"
                    ? "Fungal infection, poor air circulation, or overwatering."
                    : healthStatus === "Powdery"
                    ? "Powdery mildew due to high humidity or lack of sunlight."
                    : "None";
    
                const preventiveMeasures = healthStatus === "Rusty"
                    ? "Ensure good air circulation, avoid overwatering, and apply fungicides if necessary."
                    : healthStatus === "Powdery"
                    ? "Increase sunlight exposure, reduce humidity, and use antifungal sprays."
                    : "Keep providing optimal care to maintain health.";
    
                
                await fetch('http://localhost:3000/api/v1/plant-logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        plantId,
                        userId: user!.id, 
                        healthStatus,
                        percentage: healthPercentage,
                        possibleCauses,
                        preventiveMeasures,
                    }),
                });
    
                setHealthStatus(healthStatus);
                setHealthPercentage(healthPercentage);
                setLoadingPrediction(false);
            };
        } catch (error) {
            console.error("Error processing image:", error);
            alert("An error occurred while processing the image.");
            setLoadingPrediction(false);
        }
    };
    
    const renderHealthDetails = () => {
        if (loadingPrediction) {
            return <p className="loading-message">Analyzing the image... Please wait.</p>;
        }

        if (!healthStatus) {
            return <p>Upload a leaf image to gauge health.</p>;
        }

        const statusColor = healthPercentage! > 60 ? "green" : "red";
        const causes = healthStatus === "Rusty"
            ? "Fungal infection, poor air circulation, or overwatering."
            : healthStatus === "Powdery"
            ? "Powdery mildew due to high humidity or lack of sunlight."
            : "None";

        const prevention = healthStatus === "Rusty"
            ? "Ensure good air circulation, avoid overwatering, and apply fungicides if necessary."
            : healthStatus === "Powdery"
            ? "Increase sunlight exposure, reduce humidity, and use antifungal sprays."
            : "Keep providing optimal care to maintain health.";

        return (
            <div className="stat">
                <h2 style={{ color: statusColor }}>
                    Health Status: {healthStatus} ({healthPercentage}%)
                </h2>
                <div className="progress-bar" style={{ width: `${healthPercentage}%`, backgroundColor: statusColor }}>
                    {healthPercentage}%
                </div>
                {healthStatus !== "Healthy" && (
                    <>
                        <div className="health-info">
                            <h3>Possible Causes:</h3>
                            <p>{causes}</p>
                        </div>
                        <div className="health-info">
                            <h3>Preventive Measures:</h3>
                            <p>{prevention}</p>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="track-health-page">
            <div className="sidebar-H">
                <h2>Plant Details</h2>
                <img src={plant.imageUrl} alt={plant.name} className="plant-image" />

                <div className="Plant-d">
                <h3>{plant.name}</h3>
                <p>{`Last Watered: ${plant.lastWatered || "Not recorded."}`}</p>
                <p>{`Growth Stage: ${plant.growthStage || "Unknown"}`}</p>
                <button onClick={() => navigate(`/health-history/${plantId}`)}>View Health History</button>
                </div>
        
                
            </div>

            <div className="content">
                <h1>Track Health for {plant.name}</h1>
                <div className="health-section">
                    {renderHealthDetails()}
                    {!healthStatus && (
                        <div className="upload-container">
                            <button className="upload-button" onClick={() => document.getElementById("file-upload")?.click()}>
                                +
                            </button>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => setLeafImage(e.target.files?.[0] || null)}
                            />
                            {leafImage && <p>{leafImage.name}</p>}
                        </div>
                    )}
                    {leafImage && !loadingPrediction && (
                        <button onClick={handleHealthUpload}>Upload & Check Health</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TrackHealthPage;
