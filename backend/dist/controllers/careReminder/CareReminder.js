"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareReminderController = void 0;
const express_1 = __importDefault(require("express"));
const In_1 = require("typeorm/find-options/operator/In");
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const careReminder_1 = __importDefault(require("../../models/careReminder"));
const Plant_1 = __importDefault(require("../../models/Plant"));
exports.CareReminderController = express_1.default.Router();
exports.CareReminderController.post('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    const { plantId, reminderType, frequency, nextReminder, reminderDate, description } = req.body;
    const userId = req.user.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    if (!reminderType) {
        res.status(400).json({ message: 'Reminder type is required' });
        return;
    }
    try {
        const reminderRepository = data_source_1.AppDataSource.getRepository(careReminder_1.default);
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.default);
        const plant = await plantRepository.findOne({ where: { id: plantId } });
        if (!plant) {
            res.status(404).json({ message: 'Plant not found' });
            return;
        }
        const reminder = reminderRepository.create({
            user: { id: userId },
            plantId,
            reminderType,
            frequency: frequency || 'daily',
            nextReminder: nextReminder || new Date(),
            reminderDate,
            description,
        });
        await reminderRepository.save(reminder);
        res.status(201).json(reminder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.CareReminderController.get('/plant/:plantId', async (req, res) => {
    const { plantId } = req.params;
    const parsedPlantId = parseInt(plantId, 10);
    try {
        const reminderRepository = data_source_1.AppDataSource.getRepository(careReminder_1.default);
        const reminders = await reminderRepository.find({ where: { plantId: parsedPlantId } });
        res.status(200).json(reminders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.CareReminderController.get('/user/reminders', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Ensure userId is coming from the authenticated user
    console.log(userId);
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        // Fetch the plants owned by the user using the relationship in the Plant model
        const userOwnedPlants = await data_source_1.AppDataSource.getRepository(Plant_1.default).find({
            where: {
                owners: {
                    id: userId,
                },
            },
            relations: ['owners'], // Fetch the owners relation to ensure it works
        });
        // If the user doesn't own any plants
        if (userOwnedPlants.length === 0) {
            res.status(200).json({ message: 'No plants or reminders found.' });
            return;
        }
        // Get the plant ids of the owned plants
        const plantIds = userOwnedPlants.map((plant) => plant.id);
        // Fetch the reminders for the plants owned by the user
        const reminders = await data_source_1.AppDataSource.getRepository(careReminder_1.default).find({
            where: { plantId: (0, In_1.In)(plantIds) },
        });
        // Combine plant details with their reminders
        const remindersWithPlantDetails = reminders.map((reminder) => {
            const plant = userOwnedPlants.find((p) => parseInt(p.id, 10) === reminder.plantId); // Match plant by id
            return {
                reminderId: reminder.id,
                task: reminder.description,
                dueDate: reminder.reminderDate,
                plantId: plant === null || plant === void 0 ? void 0 : plant.id,
                plantName: plant === null || plant === void 0 ? void 0 : plant.name,
                plantImage: plant === null || plant === void 0 ? void 0 : plant.imageUrl,
            };
        });
        // Send the response with the plant and reminder details
        res.status(200).json(remindersWithPlantDetails);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = exports.CareReminderController;
