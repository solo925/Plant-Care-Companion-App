import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';
import { loginSchema } from '../../schemas/userSchemas';

export const LoginController = express.Router();

LoginController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }


    const { email, password } = value;

    try {

        const userRepository = AppDataSource.getRepository(User);


        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });


        res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default LoginController;
