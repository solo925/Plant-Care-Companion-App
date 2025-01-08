import fs from 'fs/promises';
import path from 'path';
import { AppDataSource } from '../config/data-source';
import Plant from '../models/Plant';

async function exportPlants() {
    try {
      
        await AppDataSource.initialize();
        const plantRepository = AppDataSource.getRepository(Plant);
        const plantsData = await plantRepository.find();

        
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

        
        const filePath = path.join(__dirname, 'plants_export.json');

        
        await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));
        console.log('Plant data exported successfully to', filePath);

        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error exporting plant data:', error);
    }
}

exportPlants();
