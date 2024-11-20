import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { Plant3DModel } from '../../models/Plant3Dmoedl';

const Plant3DModelController = express.Router();

Plant3DModelController.post('/:plantId', async (req: Request, res: Response): Promise<void> => {
    const plantId = req.params.plantId;
    const { filePath } = req.body;
    const format: string = 'glTF';

    try {
        const modelRepository = AppDataSource.getRepository(Plant3DModel);


        const model = modelRepository.create({
            plant: { id: plantId },
            model_format: format,
            model_file_path: filePath,
        });

        await modelRepository.save(model);

        res.status(201).json({ message: '3D model saved successfully', model });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default Plant3DModelController;
