import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source';
import { CareReminder } from '../models/careReminder';
import { User } from '../models/User';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendNotifications = async () => {
    const reminderRepository = AppDataSource.getRepository(CareReminder);
    const userRepository = AppDataSource.getRepository(User);
    const now = new Date();

    try {
        // Find all reminders due for today
        const reminders = await reminderRepository.find({
            where: {
                reminderDate: now,
            },
            relations: ['user'],
        });

        for (const reminder of reminders) {
            const user = await userRepository.findOne({ where: { id: reminder.user.id } });
            if (user) {
                // Send email notification
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Plant Care Reminder',
                    text: `Don't forget to take care of your ${reminder.plant.name} today!`,
                });
            }
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};
