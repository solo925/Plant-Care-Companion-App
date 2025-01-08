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


Plant3DModelController.get('/', async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const modelRepository = AppDataSource.getRepository(Plant3DModel);
        const [models, total] = await modelRepository
            .createQueryBuilder('model')
            .leftJoinAndSelect('model.plant', 'plant')
            .take(limit)
            .skip((page - 1) * limit)
            .getManyAndCount();

        res.status(200).json({
            data: models,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


Plant3DModelController.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const modelRepository = AppDataSource.getRepository(Plant3DModel);
        const model = await modelRepository
            .createQueryBuilder('model')
            .leftJoinAndSelect('model.plant', 'plant')
            .where('model.id = :id', { id: parseInt(id) })
            .getOne();

        if (!model) {
            res.status(404).json({ message: '3D model not found' });
            return;
        }

        res.status(200).json(model);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


Plant3DModelController.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { filePath, modelFormat } = req.body;

    try {
        const modelRepository = AppDataSource.getRepository(Plant3DModel);
        const updateResult = await modelRepository
            .createQueryBuilder()
            .update(Plant3DModel)
            .set({ model_file_path: filePath, model_format: modelFormat })
            .where('id = :id', { id: parseInt(id) })
            .returning('*')
            .execute();

        if (updateResult.affected === 0) {
            res.status(404).json({ message: '3D model not found' });
            return;
        }

        res.status(200).json(updateResult.raw[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


Plant3DModelController.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const modelRepository = AppDataSource.getRepository(Plant3DModel);
        const deleteResult = await modelRepository
            .createQueryBuilder()
            .delete()
            .from(Plant3DModel)
            .where('id = :id', { id: parseInt(id) })
            .execute();

        if (deleteResult.affected === 0) {
            res.status(404).json({ message: '3D model not found' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default Plant3DModelController;







// import express, { Request, Response } from 'express';
// import { AppDataSource } from '../../config/data-source';
// import { Plant3DModel } from '../../models/Plant3Dmoedl';

// const Plant3DModelController = express.Router();

// Plant3DModelController.post('/:plantId', async (req: Request, res: Response): Promise<void> => {
//     const plantId = req.params.plantId;
//     const { filePath } = req.body;
//     const format: string = 'glTF';

//     try {
//         const modelRepository = AppDataSource.getRepository(Plant3DModel);


//         const model = modelRepository.create({
//             plant: { id: plantId },
//             model_format: format,
//             model_file_path: filePath,
//         });

//         await modelRepository.save(model);

//         res.status(201).json({ message: '3D model saved successfully', model });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// export default Plant3DModelController;
