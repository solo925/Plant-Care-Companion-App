import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';

dotenv.config();

export const RegistrationController = express.Router();

RegistrationController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, confirmpassword } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);

        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            res.status(400).json({ message: 'Passwords do not match' });
            return;
        }

        // Hash the password
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // Create a new user
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await userRepository.save(user);

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Return the new user and token
        res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default RegistrationController;
