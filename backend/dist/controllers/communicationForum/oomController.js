"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const Room_1 = require("../../models/Room");
exports.RoomController = express_1.default.Router();
exports.RoomController.post('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { name, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        const roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        const newRoom = roomRepository.create({
            name,
            description,
            creator: { id: userId }
        });
        await roomRepository.save(newRoom);
        res.status(201).json(newRoom);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.RoomController.get('/', async (req, res) => {
    try {
        const roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        const rooms = await roomRepository.find({ relations: ['creator'] });
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.RoomController.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        const room = await roomRepository.findOne({ where: { id: parseInt(id) }, relations: ['creator', 'posts'] });
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        res.status(200).json(room);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.RoomController.put('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const { name } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });
        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }
        room.name = name || room.name;
        await roomRepository.save(room);
        res.status(200).json(room);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.RoomController.delete('/:id', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const roomRepository = data_source_1.AppDataSource.getRepository(Room_1.Room);
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });
        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }
        await roomRepository.remove(room);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.RoomController;
