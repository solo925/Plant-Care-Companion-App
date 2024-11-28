"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const UploadMiddleware_1 = require("../../middlewares/upload/UploadMiddleware");
const User_1 = require("../../models/User");
exports.ProfileController = express_1.default.Router();
exports.ProfileController.get('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const userId = req.user.id;
        const user = await userRepository.findOne({
            where: { id: userId },
            select: ['id', 'name', 'email', 'profilePhoto'],
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.ProfileController.put('/', IsAuthenticated_1.verifyToken, UploadMiddleware_1.upload.single('profilePhoto'), async (req, res) => {
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const { name, email } = req.body;
        const profilePhoto = req.file ? req.file.path : undefined;
        const updatedData = { name, email };
        if (profilePhoto)
            updatedData.profilePhoto = profilePhoto;
        const userId = req.user.id;
        const result = await userRepository.update(userId, updatedData);
        if (result.affected === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updatedUser = await userRepository.findOneBy({ id: userId });
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.ProfileController.delete('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const userId = parseInt(req.user.id, 10);
        const deleteResult = await userRepository.delete(userId);
        if (deleteResult.affected === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.ProfileController;
