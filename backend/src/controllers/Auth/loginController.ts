// src/controllers/Auth/LoginController.ts
import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/Users';

export const LoginController = express.Router();

type user = {
    id: string;
    name: string;
    email: string;
    password: string;
}

LoginController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user: any = await User.findOne({ where: { email } });
        if (!user || user === null || user === undefined) {
            res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Return the user and token
        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default LoginController;
