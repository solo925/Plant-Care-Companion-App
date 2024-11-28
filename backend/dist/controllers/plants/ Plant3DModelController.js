"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../../config/data-source");
const Plant3Dmoedl_1 = require("../../models/Plant3Dmoedl");
const Plant3DModelController = express_1.default.Router();
Plant3DModelController.post('/:plantId', async (req, res) => {
    const plantId = req.params.plantId;
    const { filePath } = req.body;
    const format = 'glTF';
    try {
        const modelRepository = data_source_1.AppDataSource.getRepository(Plant3Dmoedl_1.Plant3DModel);
        const model = modelRepository.create({
            plant: { id: plantId },
            model_format: format,
            model_file_path: filePath,
        });
        await modelRepository.save(model);
        res.status(201).json({ message: '3D model saved successfully', model });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = Plant3DModelController;
