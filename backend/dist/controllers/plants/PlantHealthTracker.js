"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantHealthLogController = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const Plant_1 = require("../../models/Plant");
const PlantHealth_1 = __importDefault(require("../../models/PlantHealth"));
const User_1 = require("../../models/User");
exports.PlantHealthLogController = express_1.default.Router();
exports.PlantHealthLogController.post('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    const { plantId, userId, healthStatus, percentage, possibleCauses, preventiveMeasures } = req.body;
    try {
        const plant = await data_source_1.AppDataSource.getRepository(Plant_1.Plant).findOne({ where: { id: plantId } });
        const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({ where: { id: userId } });
        if (!plant || !user) {
            res.status(404).json({ message: 'Plant or user not found' });
            return;
        }
        const healthLog = data_source_1.AppDataSource.getRepository(PlantHealth_1.default).create({
            plant,
            user,
            healthStatus,
            percentage,
            possibleCauses,
            preventiveMeasures,
            observationDate: new Date(),
        });
        await data_source_1.AppDataSource.getRepository(PlantHealth_1.default).save(healthLog);
        res.status(201).json(healthLog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PlantHealthLogController.get('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    try {
        const healthLogs = await data_source_1.AppDataSource.getRepository(PlantHealth_1.default).find({
            order: { observationDate: 'DESC' },
            relations: ['plant', 'user'],
        });
        res.status(200).json(healthLogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PlantHealthLogController.get('/:plantId', IsAuthenticated_1.verifyToken, async (req, res) => {
    const { plantId } = req.params;
    try {
        const healthLogs = await data_source_1.AppDataSource.getRepository(PlantHealth_1.default).find({
            where: { plant: { id: plantId } },
            order: { observationDate: 'DESC' },
        });
        res.status(200).json(healthLogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.PlantHealthLogController.delete('/:logId', IsAuthenticated_1.verifyToken, async (req, res) => {
    const { logId } = req.params;
    try {
        const healthLog = await data_source_1.AppDataSource.getRepository(PlantHealth_1.default).findOne({ where: { id: logId } });
        if (!healthLog) {
            res.status(404).json({ message: 'Health log not found' });
            return;
        }
        await data_source_1.AppDataSource.getRepository(PlantHealth_1.default).remove(healthLog);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.PlantHealthLogController;
