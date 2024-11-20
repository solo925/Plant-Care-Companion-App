import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Plant } from '../../models/Plant';
import PlantHealthLog from '../../models/PlantHealth';
import { User } from '../../models/User';
import { FeedbackService } from '../../services/feedBackServices';

export const PlantHealthLogController = express.Router();

PlantHealthLogController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { plantId } = req.params;
    const { userId, leafColor, growthProgress, moistureLevel, pestPresence, otherNotes } = req.body;

    try {
        const plantRepository = AppDataSource.getRepository(Plant);
        const userRepository = AppDataSource.getRepository(User);
        const healthLogRepository = AppDataSource.getRepository(PlantHealthLog);

        const plant = await plantRepository.findOne({ where: { id: plantId } });
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!plant || !user) {
            res.status(404).json({ message: 'Plant or user not found' });
            return;
        }

        const newHealthLog = healthLogRepository.create({
            plant,
            user,
            leafColor,
            growthProgress,
            moistureLevel,
            pestPresence,
            otherNotes,
            observationDate: new Date()
        });

        await healthLogRepository.save(newHealthLog);


        const feedbacks = await FeedbackService.saveFeedbacks(newHealthLog);

        res.status(201).json({ newHealthLog, feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantHealthLogController.get('/', async (req: Request, res: Response) => {
    const { plantId } = req.params;

    try {
        const healthLogRepository = AppDataSource.getRepository(PlantHealthLog);
        const healthLogs = await healthLogRepository.find({
            where: { plant: { id: plantId } },
            relations: ['plant', 'user'],
            order: { observationDate: 'DESC' }
        });

        res.status(200).json(healthLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantHealthLogController.put('/:logId', async (req: Request, res: Response): Promise<void> => {
    const { logId } = req.params;
    const { leafColor, growthProgress, moistureLevel, pestPresence, otherNotes } = req.body;

    try {
        const healthLogRepository = AppDataSource.getRepository(PlantHealthLog);
        const healthLog = await healthLogRepository.findOne({ where: { id: logId } });

        if (!healthLog) {
            res.status(404).json({ message: 'Health log not found' });
            return;
        }

        healthLog!.leafColor = leafColor ?? healthLog!.leafColor;
        healthLog!.growthProgress = growthProgress ?? healthLog!.growthProgress;
        healthLog!.moistureLevel = moistureLevel ?? healthLog!.moistureLevel;
        healthLog!.pestPresence = pestPresence ?? healthLog!.pestPresence;
        healthLog!.otherNotes = otherNotes ?? healthLog!.otherNotes;

        await healthLogRepository.save(healthLog!);
        res.status(200).json(healthLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantHealthLogController.delete('/:logId', async (req: Request, res: Response): Promise<void> => {
    const { logId } = req.params;

    try {
        const healthLogRepository = AppDataSource.getRepository(PlantHealthLog);
        const healthLog = await healthLogRepository.findOne({ where: { id: logId } });

        if (!healthLog) {
            res.status(404).json({ message: 'Health log not found' });
            return;
        }

        await healthLogRepository.remove(healthLog!);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default PlantHealthLogController;
