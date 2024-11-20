import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { MoreThan } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../models/User';

dotenv.config();

const PasswordResetController = express.Router();


PasswordResetController.post('/', async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user!.resetPasswordToken = token;
        user!.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await userRepository.save(user!);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 30000,
            logger: true,
            debug: true


        });


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user!.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
        };

        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP Connection Error:', error);
            } else {
                console.log('SMTP Connection Successful');
            }
        });


        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

PasswordResetController.post('/:token', async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { resetPasswordToken: token, resetPasswordExpires: MoreThan(new Date()) }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
        }

        await user!.setPassword(password);
        user!.resetPasswordToken = undefined;
        user!.resetPasswordExpires = undefined;

        await userRepository.save(user!);

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default PasswordResetController;




