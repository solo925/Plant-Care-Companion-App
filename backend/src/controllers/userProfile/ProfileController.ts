import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { User } from '../../models/User';

export const ProfileController = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_photos');
    },
    filename: (req: CustomRequest, file, cb) => {
        cb(null, `${req.user!.id}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage });

// Get user profile
ProfileController.get('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Ensure that id is treated as a number
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

// Update user profile (with optional profile photo)
ProfileController.put('/', verifyToken, upload.single('profilePhoto'), async (req: CustomRequest, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { name, email } = req.body;
        const profilePhoto = req.file ? req.file.path : undefined;

        // Prepare update data
        const updatedData: Partial<User> = { name, email }; // Ensure this matches User type
        if (profilePhoto) updatedData.profilePhoto = profilePhoto;

        // Ensure that id is treated as a number
        const userId = req.user!.id;

        // Update user
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

// Delete user profile
ProfileController.delete('/', verifyToken, async (req: CustomRequest, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);

        // Ensure that id is treated as a number
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
