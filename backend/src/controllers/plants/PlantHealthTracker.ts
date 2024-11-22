import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Plant } from '../../models/Plant';
import PlantHealthLog from '../../models/PlantHealth';
import { User } from '../../models/User';

export const PlantHealthLogController = express.Router();

PlantHealthLogController.post('/', verifyToken, async (req: Request, res: Response) => {
    const { plantId, userId, healthStatus, percentage, possibleCauses, preventiveMeasures } = req.body;

    try {
        const plant = await AppDataSource.getRepository(Plant).findOne({ where: { id: plantId } });
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });

        if (!plant || !user) {
            res.status(404).json({ message: 'Plant or user not found' });
            return;
        }

        const healthLog = AppDataSource.getRepository(PlantHealthLog).create({
            plant,
            user,
            healthStatus,
            percentage,
            possibleCauses,
            preventiveMeasures,
            observationDate: new Date(),
        });

        await AppDataSource.getRepository(PlantHealthLog).save(healthLog);
        res.status(201).json(healthLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantHealthLogController.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const healthLogs = await AppDataSource.getRepository(PlantHealthLog).find({
            order: { observationDate: 'DESC' },
            relations: ['plant', 'user'],
        });

        res.status(200).json(healthLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PlantHealthLogController.get('/:plantId', verifyToken, async (req: Request, res: Response) => {
    const { plantId } = req.params;

    try {
        const healthLogs = await AppDataSource.getRepository(PlantHealthLog).find({
            where: { plant: { id: plantId } },
            order: { observationDate: 'DESC' },
        });

        res.status(200).json(healthLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


PlantHealthLogController.delete('/:logId', verifyToken, async (req: Request, res: Response) => {
    const { logId } = req.params;

    try {
        const healthLog = await AppDataSource.getRepository(PlantHealthLog).findOne({ where: { id: logId } });

        if (!healthLog) {
            res.status(404).json({ message: 'Health log not found' });
            return;
        }

        await AppDataSource.getRepository(PlantHealthLog).remove(healthLog);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default PlantHealthLogController;
