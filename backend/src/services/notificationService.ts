import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { AppDataSource } from '../config/data-source';
import { CareReminder } from '../models/careReminder';
import { User } from '../models/User';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendNotifications = async () => {
    const reminderRepository = AppDataSource.getRepository(CareReminder);
    const now = new Date();

    try {
        
        const reminders = await reminderRepository
            .createQueryBuilder('reminder')
            .leftJoinAndSelect('reminder.user', 'user')
            .leftJoinAndSelect('reminder.plant', 'plant')
            .where('reminder.reminderDate = :reminderDate', {
                reminderDate: new Date(new Date().setHours(0, 0, 0, 0)),
            })
            .getMany();

        for (const reminder of reminders) {
            const user = reminder.user;

            if (user) {
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


// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
// import { AppDataSource } from '../config/data-source';
// import { CareReminder } from '../models/careReminder';
// import { User } from '../models/User';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// export const sendNotifications = async () => {
//     const reminderRepository = AppDataSource.getRepository(CareReminder);
//     const userRepository = AppDataSource.getRepository(User);
//     const now = new Date();

//     try {

//         const reminders = await reminderRepository.find({
//             where: {
//                 reminderDate: new Date(new Date().setHours(0, 0, 0, 0)),
//             },
//             relations: ['user', 'plant'],
//         });


//         for (const reminder of reminders) {
//             const user = reminder.user;

//             if (user) {

//                 await transporter.sendMail({
//                     from: process.env.EMAIL_USER,
//                     to: user.email,
//                     subject: 'Plant Care Reminder',
//                     text: `Don't forget to take care of your ${reminder.plant.name} today!`,
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Error sending notifications:', error);
//     }
// };
