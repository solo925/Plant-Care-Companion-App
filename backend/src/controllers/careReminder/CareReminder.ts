import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import CareReminder from '../../models/careReminder';
import Plant from '../../models/Plant';


export const CareReminderController = express.Router();

interface R1 extends Request {
    user?: {
        id: string;
    }
}

CareReminderController.post('/', verifyToken, async (req: R1, res: Response): Promise<void> => {
    const { plantId, reminderType, frequency, nextReminder, reminderDate, description } = req.body;


    const userId = req.user!.id;


    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    if (!reminderType) {
        res.status(400).json({ message: 'Reminder type is required' });
        return;
    }

    try {
        const reminderRepository = AppDataSource.getRepository(CareReminder);
        const plantRepository = AppDataSource.getRepository(Plant);


        const plant = await plantRepository.findOne({ where: { id: plantId } });
        if (!plant) {
            res.status(404).json({ message: 'Plant not found' });
            return;
        }


        const reminder = reminderRepository.create({
            user: { id: userId },
            plantId,
            reminderType,
            frequency: frequency || 'daily',
            nextReminder: nextReminder || new Date(),
            reminderDate,
            description,
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
    const parsedPlantId = parseInt(plantId, 10);

    try {
        const reminderRepository = AppDataSource.getRepository(CareReminder);


        const reminders = await reminderRepository.find({ where: { plantId: parsedPlantId } });
        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default CareReminderController;
