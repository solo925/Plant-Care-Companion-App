import { Request, Response, Router } from 'express';
import { AppDataSource } from '../../config/data-source';
import { verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated'; // Assuming you have an auth middleware
import { Plant } from '../../models/Plant';
import { User } from '../../models/User';

const PlantController = Router();


interface R extends Request {
    user?: any
}

PlantController.post('/', verifyToken, async (req: R, res: Response): Promise<void> => {
    const { name, species, wateringFrequency, lastWatered } = req.body;

    try {
        const plantRepository = AppDataSource.getRepository(Plant);
        const userRepository = AppDataSource.getRepository(User);


        const user = await userRepository.findOne({ where: { id: req.user.id } });
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
        const plants = await plantRepository.find()
        res.status(200).json(plants)


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" })

    }
})


PlantController.get('/', verifyToken, async (req: R, res: Response): Promise<void> => {
    try {
        const plantRepository = AppDataSource.getRepository(Plant);
        const plants = await plantRepository.find({ where: { user: { id: req.user.id } } });
        res.status(200).json(plants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default PlantController;
