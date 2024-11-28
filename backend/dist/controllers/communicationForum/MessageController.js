"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const Message_1 = require("../../models/Message");
const MessageController = express_1.default.Router();
MessageController.get('/history/:recipientId', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { recipientId } = req.params;
    if (!senderId) {
        res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
    }
    try {
        const messageRepository = data_source_1.AppDataSource.getRepository(Message_1.Message);
        const messages = await messageRepository.find({
            where: [
                { sender: { id: senderId }, recipient: { id: recipientId } },
                { sender: { id: recipientId }, recipient: { id: senderId } }
            ],
            order: { createdAt: 'ASC' }
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching message history:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
MessageController.post('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { roomId, message } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
    }
    if (!roomId || !message) {
        res.status(400).json({ message: 'Bad Request: Missing roomId or message' });
    }
    try {
        const messageRepository = data_source_1.AppDataSource.getRepository(Message_1.Message);
        const newMessage = messageRepository.create({
            content: message,
            room: { id: roomId },
            sender: { id: userId }
        });
        await messageRepository.save(newMessage);
        app_1.io.to(roomId.toString()).emit('newMessage', newMessage);
        res.status(201).json({ data: newMessage, message: 'Message sent successfully' });
    }
    catch (error) {
        console.error("Error saving new message:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
MessageController.get('/:roomId', IsAuthenticated_1.verifyToken, async (req, res) => {
    const { roomId } = req.params;
    const parsedRoomId = parseInt(roomId);
    if (isNaN(parsedRoomId)) {
        res.status(400).json({ message: 'Invalid roomId' });
    }
    try {
        const messageRepository = data_source_1.AppDataSource.getRepository(Message_1.Message);
        const messages = await messageRepository.find({
            where: { room: { id: parsedRoomId } },
            order: { createdAt: 'ASC' }
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error fetching messages for room:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = MessageController;
