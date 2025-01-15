import bcrypt from 'bcrypt';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';
import { loginSchema } from '../../schemas/userSchemas';
import { asyncHandler } from '../../middlewares/errorhandler/errorHandler';

export const LoginController = express.Router();

LoginController.post('/', asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    const { email, password } = value;


    const userRepository = AppDataSource.getRepository(User);

    // const user = await userRepository.findOne({ where: { email } });
    const user = await userRepository
        .createQueryBuilder('user')
        .where('user.email = email', { email })
        .getOne();

    if (!user) {
        next(new Error('Invalid email or password'))
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        next(new Error('Invalid email or password'))
        return;
    }


    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, profilePhoto: user.profilePhoto }
    });

}));

export default LoginController;
