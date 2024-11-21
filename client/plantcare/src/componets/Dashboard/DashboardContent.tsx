// src/pages/DashboardContent.tsx
import { useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa'; // Importing a bell icon for reminders
import { useNavigate } from 'react-router-dom';
import { PlantType } from '../../Types';
import MyPlantsPage from '../Plants/MyPlants';

function DashboardContent() {
    const [ownedPlants, setOwnedPlants] = useState<PlantType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserReminders = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/care-reminder/user/reminders', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    // Set owned plants based on reminders
                    setOwnedPlants(data.map((reminder: { plantId: string, plant: { name: string, imageUrl: string } }) => ({
                        id: reminder.plantId,
                        name: reminder.plant.name,
                        imageUrl: reminder.plant.imageUrl,
                    })));
                }
            } catch (error) {
                console.error('Error fetching care reminders:', error);
            }
        };

        fetchUserReminders();
    }, []);

    return (
      <div className="dashboard-content">
        <section className="reminders-link-section">
                <div className="reminder-link">
                    <button onClick={() => navigate('/reminders')} className="reminder-button">
                        <FaRegBell size={24} />
                    </button>
                </div>
            </section>
  
            <section className="my-plants-section">
                <MyPlantsPage />
            </section>

           

        </div>
    );
}

export default DashboardContent;
