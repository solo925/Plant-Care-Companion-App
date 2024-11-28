"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const data_source_1 = require("../config/data-source");
const careReminder_1 = require("../models/careReminder");
const User_1 = require("../models/User");
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendNotifications = async () => {
    const reminderRepository = data_source_1.AppDataSource.getRepository(careReminder_1.CareReminder);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const now = new Date();
    try {
        const reminders = await reminderRepository.find({
            where: {
                reminderDate: new Date(new Date().setHours(0, 0, 0, 0)),
            },
            relations: ['user', 'plant'],
        });
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
    }
    catch (error) {
        console.error('Error sending notifications:', error);
    }
};
exports.sendNotifications = sendNotifications;
