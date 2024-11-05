import express, { Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { upload } from '../../middlewares/upload/UploadMiddleware';
import { User } from '../../models/User';

export const ProfileController = express.Router();

ProfileController.get('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);


        const userId = req.user!.id;

        const user = await userRepository.findOne({
            where: { id: userId },
            select: ['id', 'name', 'email', 'profilePhoto'],
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


ProfileController.put('/', verifyToken, upload.single('profilePhoto'), async (req: CustomRequest, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { name, email } = req.body;
        const profilePhoto = req.file ? req.file.path : undefined;

        const updatedData: Partial<User> = { name, email };
        if (profilePhoto) updatedData.profilePhoto = profilePhoto;


        const userId = req.user!.id;


        const result = await userRepository.update(userId, updatedData);
        if (result.affected === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const updatedUser = await userRepository.findOneBy({ id: userId });
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


ProfileController.delete('/', verifyToken, async (req: CustomRequest, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);


        const userId = parseInt(req.user!.id as string, 10);

        const deleteResult = await userRepository.delete(userId);

        if (deleteResult.affected === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default ProfileController;
