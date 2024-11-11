import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';
import { userSchema } from '../../schemas/userSchemas';


dotenv.config();

export const RegistrationController = express.Router();

RegistrationController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { error, value } = userSchema.validate(req.body);


    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    const { name, email, password, confirmpassword } = value;

    try {
        const userRepository = AppDataSource.getRepository(User);


        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);


        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await userRepository.save(user);


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });


        res.status(201).json({ user, token });
        // res.redirect('localhost:3000/api/v1/auth/login')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default RegistrationController;
