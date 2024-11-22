import { Request, Response, Router } from 'express';
import { AppDataSource } from '../../config/data-source';
import { verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Plant } from '../../models/Plant';
import { User } from '../../models/User';

const PlantController = Router();


interface R extends Request {
    user?: {
        id?: string;
        ownedPlants: Plant[];
    }
}

PlantController.post('/', verifyToken, async (req: R, res: Response): Promise<void> => {
    const { name, species, wateringFrequency, lastWatered } = req.body;

    try {
        const plantRepository = AppDataSource.getRepository(Plant);
        const userRepository = AppDataSource.getRepository(User);


        const user = await userRepository.findOne({ where: { id: req.user?.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }


        const plant = plantRepository.create({
            name,
            species,
            wateringFrequency,
            lastWatered,
            user,
        });


        await plantRepository.save(plant);


        res.status(201).json(plant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantController.get('/all', async (req: Request, res: Response): Promise<void> => {
    try {
        const plantRepository = AppDataSource.getRepository(Plant)
        const plants = await plantRepository.find({
            order: {
                id: 'DESC',
            },
        });
        res.status(200).json(plants)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" })

    }
})


PlantController.get('/', verifyToken, async (req: R, res: Response): Promise<void> => {
    try {
        const plantRepository = AppDataSource.getRepository(Plant);
        const plants = await plantRepository.find({ where: { user: { id: req.user?.id } } });
        res.status(200).json(plants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PlantController.post(
    '/user/plants/:plantId',
    verifyToken,
    async (req: R, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const { plantId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        try {
            const userRepository = AppDataSource.getRepository(User);
            const plantRepository = AppDataSource.getRepository(Plant);

            const user = await userRepository.findOne({
                where: { id: userId },
                relations: ['ownedPlants'],
            });

            const plant = await plantRepository.findOne({
                where: { id: plantId },
            });

            if (!user || !plant) {
                res.status(404).json({ message: 'User or plant not found' });
                return;
            }

            if (!user.ownedPlants) {
                user.ownedPlants = [];
            }


            const alreadyOwned = user.ownedPlants.some((ownedPlant) => ownedPlant.id === plant.id);
            if (alreadyOwned) {
                res.status(400).json({ message: 'Plant is already in your collection!' });
                return;
            }

            user.ownedPlants.push(plant);
            await userRepository.save(user);

            res.status(200).json({ message: 'Plant added to your collection!' });
        } catch (error) {
            console.error('Error adding plant to user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);


PlantController.get(
    '/user/plants',
    verifyToken,
    async (req: R, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        try {
            const userRepository = AppDataSource.getRepository(User);

            const user = await userRepository.findOne({
                where: { id: userId },
                relations: ['ownedPlants'],
            });

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json(user.ownedPlants);
        } catch (error) {
            console.error('Error fetching user plants:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);


PlantController.delete('/user/plants/:plantId', verifyToken, async (req: R, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { plantId } = req.params;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const plantRepository = AppDataSource.getRepository(Plant);

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['ownedPlants'],
        });

        const plant = await plantRepository.findOne({ where: { id: plantId } });

        if (!user || !plant) {
            res.status(404).json({ message: 'User or plant not found' });
        }

        if (user) {

            user.ownedPlants = user.ownedPlants.filter((ownedPlant) => ownedPlant.id !== plant!.id);
            await userRepository.save(user);
        }

        res.status(200).json({ message: 'Plant removed from your collection!' });
    } catch (error) {
        console.error('Error removing plant from user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




export default PlantController;
