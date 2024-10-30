import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import CareReminder from '../../models/careReminder';
import Plant from '../../models/Plant';

export const CareReminderController = express.Router();


CareReminderController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { plantId, reminderType, frequency, nextReminder } = req.body;

    try {
        const reminderRepository = AppDataSource.getRepository(CareReminder);
        const plantRepository = AppDataSource.getRepository(Plant);

        // Check if the plant exists
        const plant = await plantRepository.findOne({ where: { id: plantId } });
        if (!plant) {
            res.status(404).json({ message: 'Plant not found' });
            return;
        }


        const reminder = reminderRepository.create({
            plantId,
            reminderType,
            frequency,
            nextReminder,
        });


        await reminderRepository.save(reminder);


        res.status(201).json(reminder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


CareReminderController.get('/plant/:plantId', async (req: Request, res: Response): Promise<void> => {
    const { plantId } = req.params;

    // Convert plantId from string to number
    const parsedPlantId = parseInt(plantId, 10);

    try {
        const reminderRepository = AppDataSource.getRepository(CareReminder);

        // Fetch reminders for the specified plant
        const reminders = await reminderRepository.find({ where: { plantId: parsedPlantId } });
        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default CareReminderController;
