"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const User_1 = require("../../models/User");
const UserController = express_1.default.Router();
UserController.get('/', async (req, res) => {
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const users = await userRepository.find({
            select: ['id', 'email', 'name', 'profilePhoto'],
            relations: ['plants', 'reminders', 'posts', 'comments', 'rooms']
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
});
exports.default = UserController;
