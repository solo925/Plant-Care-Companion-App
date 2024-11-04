import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';

const UserController = express.Router();


UserController.get('/', async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);


        const users = await userRepository.find({
            select: ['id', 'email', 'name', 'profilePhoto'],
            relations: ['plants', 'reminders', 'posts', 'comments', 'rooms']
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});

export default UserController;
