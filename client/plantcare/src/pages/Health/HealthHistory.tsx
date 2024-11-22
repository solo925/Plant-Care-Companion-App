import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { plantHealthLogTypes } from '../../Types';

const HealthHistoryPage = () => {
    const { plantId } = useParams();
    console.log(plantId)
    const [healthLogs, setHealthLogs] = useState<plantHealthLogTypes[]>([]);

    useEffect(() => {
        const fetchHealthLogs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/plant-logs/${plantId}`,
                    {
                        method:'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });
                if (!response.ok) throw new Error('Failed to fetch health logs');
                const data = await response.json();
                setHealthLogs(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHealthLogs();
    }, [plantId]);

    const handleDeleteLog = async (logId:string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/plant-logs/${logId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    
            });
            if (!response.ok) throw new Error('Failed to delete health log');
            setHealthLogs(healthLogs.filter((log) => log.id !== logId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='health-info'>
            <h1>Health History</h1>
            {healthLogs.map((log) => (
                <div key={log.id}>
                    <p>{log.healthStatus} - {log.percentage}%</p>
                    <p>{log.possibleCauses}</p>
                    <p>{log.preventiveMeasures}</p>
                    <button onClick={() => handleDeleteLog(log.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default HealthHistoryPage;
