import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/CareReminderPage.css';
import { careReminderTypes } from '../../Types';

const CareReminderPage: React.FC = () => {
  const { plantId } = useParams(); 
  const [reminders, setReminders] = useState<careReminderTypes[]>([]);
  const [newReminder, setNewReminder] = useState({
    reminderType: '',
    description: '',
    reminderDate: '',
    reminderTime: '', 
  });

  // Fetch reminders
  const fetchReminders = async () => {
    if (!plantId) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/care-reminder/plant/${plantId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setReminders(data);
      console.log('Fetched reminders:', data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

 
  const handleAddReminder = async () => {
    if (!plantId) return;
    try {
      const fullDateTime = new Date(`${newReminder.reminderDate}T${newReminder.reminderTime}`).toISOString();
      const response = await fetch(`http://localhost:3000/api/v1/care-reminder/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          ...newReminder, 
          reminderDate: fullDateTime, 
          plantId 
        }),
      });
  
      if (response.ok) {
        setNewReminder({ 
          reminderType: '', 
          description: '', 
          reminderDate: '', 
          reminderTime: '' 
        });
        fetchReminders(); 
      } else {
        console.error("Failed to add reminder. Status:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchReminders();
  }, [plantId]);

  return (
    <div className="care-reminder-page">
      <h1>Plant Care Reminders</h1>
      <div className="reminder-list">
        {reminders.map((reminder) => (
          <div className="reminder-card" key={reminder.id}>
            <h3>{reminder.reminderType}</h3>
            <p>{reminder.description}</p>
            <span>{new Date(reminder.reminderDate).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="add-reminder">
        <h2>Add New Reminder</h2>
        <input
          type="text"
          placeholder="Reminder Type"
          value={newReminder.reminderType}
          onChange={(e) => setNewReminder({ ...newReminder, reminderType: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newReminder.description}
          onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
        />
        <input
          type="date"
          value={newReminder.reminderDate}
          onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
        />
        <input
          type="time"
          value={newReminder.reminderTime}
          onChange={(e) => setNewReminder({ ...newReminder, reminderTime: e.target.value })}
        />
        <button onClick={handleAddReminder}>Add Reminder</button>
      </div>
    </div>
  );
};

export default CareReminderPage;
