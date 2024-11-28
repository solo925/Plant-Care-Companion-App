"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("../config/data-source");
const Plant_1 = __importDefault(require("../models/Plant"));
async function exportPlants() {
    try {
        // Initialize data source
        await data_source_1.AppDataSource.initialize();
        const plantRepository = data_source_1.AppDataSource.getRepository(Plant_1.default);
        // Fetch all plants from the database
        const plantsData = await plantRepository.find();
        // Map data to plain objects
        const exportData = plantsData.map((plant) => ({
            name: plant.name,
            species: plant.species,
            wateringFrequency: plant.wateringFrequency,
            lastWatered: plant.lastWatered,
            imageUrl: plant.imageUrl,
            description: plant.description,
            growingConditions: plant.growingConditions,
            size: plant.size,
            createdAt: plant.createdAt,
            updatedAt: plant.updatedAt,
        }));
        // Define path for output JSON file
        const filePath = path_1.default.join(__dirname, 'plants_export.json');
        // Write the data to a JSON file
        await promises_1.default.writeFile(filePath, JSON.stringify(exportData, null, 2));
        console.log('Plant data exported successfully to', filePath);
        // Optionally, close the data source after the operation
        await data_source_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error('Error exporting plant data:', error);
    }
}
// Execute the export function
exportPlants();
