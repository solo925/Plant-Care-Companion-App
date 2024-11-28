"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../config/data-source");
const User_1 = require("../../models/User");
dotenv_1.default.config();
const PasswordResetController = express_1.default.Router();
PasswordResetController.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await userRepository.save(user);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const transporter = nodemailer_1.default.createTransport({
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
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
        };
        transporter.verify((error, success) => {
            if (error) {
                console.error('SMTP Connection Error:', error);
            }
            else {
                console.log('SMTP Connection Successful');
            }
        });
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
PasswordResetController.post('/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { resetPasswordToken: token, resetPasswordExpires: (0, typeorm_1.MoreThan)(new Date()) }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired token' });
        }
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await userRepository.save(user);
        res.status(200).json({ message: 'Password successfully reset' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = PasswordResetController;
