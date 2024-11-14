import fs from 'fs/promises';
import path from 'path';
import { AppDataSource } from '../config/data-source';
import Plant from '../models/Plant';

async function exportPlants() {
    try {
        // Initialize data source
        await AppDataSource.initialize();
        const plantRepository = AppDataSource.getRepository(Plant);

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
        const filePath = path.join(__dirname, 'plants_export.json');

        // Write the data to a JSON file
        await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));
        console.log('Plant data exported successfully to', filePath);

        // Optionally, close the data source after the operation
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error exporting plant data:', error);
    }
}

// Execute the export function
exportPlants();
