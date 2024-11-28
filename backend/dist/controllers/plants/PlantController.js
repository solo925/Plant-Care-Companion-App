"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../../config/data-source");
const IsAuthenticated_1 = require("../../middlewares/Authmidlewares/IsAuthenticated");
const Plant_1 = require("../../models/Plant");
const User_1 = require("../../models/User");
const PlantController = (0, express_1.Router)();
PlantController.post('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const { name, species, wateringFrequency, lastWatered } = req.body;
    try {
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.Plant);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const plant = plantRepository.create({
            name,
            species,
            wateringFrequency,
            lastWatered,
            user,
        });
        await plantRepository.save(plant);
        res.status(201).json(plant);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
PlantController.get('/all', async (req, res) => {
    try {
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.Plant);
        const plants = await plantRepository.find({
            order: {
                id: 'DESC',
            },
        });
        res.status(200).json(plants);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
});
PlantController.get('/', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    try {
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.Plant);
        const plants = await plantRepository.find({ where: { user: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } } });
        res.status(200).json(plants);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
PlantController.post('/user/plants/:plantId', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { plantId } = req.params;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.Plant);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['ownedPlants'],
        });
        const plant = await plantRepository.findOne({
            where: { id: plantId },
        });
        if (!user || !plant) {
            res.status(404).json({ message: 'User or plant not found' });
            return;
        }
        if (!user.ownedPlants) {
            user.ownedPlants = [];
        }
        const alreadyOwned = user.ownedPlants.some((ownedPlant) => ownedPlant.id === plant.id);
        if (alreadyOwned) {
            res.status(400).json({ message: 'Plant is already in your collection!' });
            return;
        }
        user.ownedPlants.push(plant);
        await userRepository.save(user);
        res.status(200).json({ message: 'Plant added to your collection!' });
    }
    catch (error) {
        console.error('Error adding plant to user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
PlantController.get('/user/plants', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['ownedPlants'],
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.ownedPlants);
    }
    catch (error) {
        console.error('Error fetching user plants:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
PlantController.delete('/user/plants/:plantId', IsAuthenticated_1.verifyToken, async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { plantId } = req.params;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.Plant);
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['ownedPlants'],
        });
        const plant = await plantRepository.findOne({ where: { id: plantId } });
        if (!user || !plant) {
            res.status(404).json({ message: 'User or plant not found' });
        }
        if (user) {
            user.ownedPlants = user.ownedPlants.filter((ownedPlant) => ownedPlant.id !== plant.id);
            await userRepository.save(user);
        }
        res.status(200).json({ message: 'Plant removed from your collection!' });
    }
    catch (error) {
        console.error('Error removing plant from user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = PlantController;
