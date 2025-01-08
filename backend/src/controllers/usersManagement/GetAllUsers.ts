import express, { Request, Response } from 'express';
import { In } from 'typeorm';
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

        const plant = await plantRepository
            .createQueryBuilder("plant")
            .where("plant.id = :id", { id: plantId })
            .getOne();

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

        const reminders = await reminderRepository
            .createQueryBuilder("reminder")
            .where("reminder.plantId = :plantId", { plantId: parsedPlantId })
            .getMany();

        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


CareReminderController.get('/user/reminders', verifyToken, async (req: R1, res: Response): Promise<void> => {
    const userId = req.user?.id;
    console.log(userId);

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
       
        const userOwnedPlants = await AppDataSource.getRepository(Plant)
            .createQueryBuilder("plant")
            .leftJoin("plant.owners", "owner")
            .where("owner.id = :userId", { userId })
            .getMany();

        if (userOwnedPlants.length === 0) {
            res.status(200).json({ message: 'No plants or reminders found.' });
            return;
        }

        const plantIds = userOwnedPlants.map((plant) => plant.id);

        const reminders = await AppDataSource.getRepository(CareReminder)
            .createQueryBuilder("reminder")
            .where("reminder.plantId IN (:...plantIds)", { plantIds })
            .getMany();

        const remindersWithPlantDetails = reminders.map((reminder) => {
            const plant = userOwnedPlants.find((p) => parseInt(p.id, 10) === reminder.plantId);

            return {
                reminderId: reminder.id,
                task: reminder.description,
                dueDate: reminder.reminderDate,
                plantId: plant?.id,
                plantName: plant?.name,
                plantImage: plant?.imageUrl,
            };
        });

        
        res.status(200).json(remindersWithPlantDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default CareReminderController;


// import express, { Request, Response } from 'express';
// import { AppDataSource } from '../../config/data-source';
// import { User } from '../../models/User';


// const UserController = express.Router();


// UserController.get('/', async (req: Request, res: Response) => {
//     try {
//         const userRepository = AppDataSource.getRepository(User);


//         const users = await userRepository.find({
//             select: ['id', 'email', 'name', 'profilePhoto'],
//             relations: ['plants', 'reminders', 'posts', 'comments', 'rooms']
//         });

//         res.status(200).json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error while fetching users' });
//     }
// });



// export default UserController;
