import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
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



UserController.get('/me', async (req: Request, res: Response): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header
    if (!token) {
        res.status(401).json({ message: 'Token is required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});




export default UserController;
