import { useEffect, useState } from 'react';
import { careReminderTypes } from '../../Types';

function MyRemindersPage() {
    const [careReminders, setCareReminders] = useState<careReminderTypes[]>([]);

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
                    setCareReminders(data);
                }
            } catch (error) {
                console.error('Error fetching care reminders:', error);
            }
        };

        fetchUserReminders();
    }, []);

    return (
        <div className="my-reminders-page">
            <h1>My Care Reminders</h1>
            <div className="reminders-list">
                {careReminders.map((reminder) => (
                    <div key={reminder.id} className="reminder-card">
                        <h3>{reminder.plantName}</h3>
                        <p>{`Task: ${reminder.task}`}</p>
                        <p>{`Due: ${new Date(reminder.dueDate).toLocaleDateString()}`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyRemindersPage;
