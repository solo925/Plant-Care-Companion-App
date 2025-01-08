import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Room } from '../../models/Room';

export const RoomController = express.Router();

RoomController.post('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const roomRepository = AppDataSource.getRepository(Room);
      
        /*
        const newRoom = roomRepository.create({
            name,
            description,
            creator: { id: userId }
        });
        await roomRepository.save(newRoom);
        */
        
        const newRoom = await roomRepository
            .createQueryBuilder()
            .insert()
            .into(Room)
            .values({
                name,
                description,
                creator: { id: userId }
            })
            .returning('*')
            .execute();

        res.status(201).json(newRoom.raw[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

RoomController.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const roomRepository = AppDataSource.getRepository(Room);
        
        /*
        const rooms = await roomRepository.find({ relations: ['creator'] });
        */
      
        const rooms = await roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.creator', 'creator')
            .getMany();

        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

RoomController.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const roomRepository = AppDataSource.getRepository(Room);
        
        /*
        const room = await roomRepository.
        findOne({ where: { id: parseInt(id) }, relations: ['creator', 'posts'] });
        */
       
        const room = await roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.creator', 'creator')
            .leftJoinAndSelect('room.posts', 'posts')
            .where('room.id = :id', { id: parseInt(id) })
            .getOne();

        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }

        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

RoomController.put('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.id;

    try {
        const roomRepository = AppDataSource.getRepository(Room);
        
        /*
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });

        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        room.name = name || room.name;

        await roomRepository.save(room);
        */
       
        const updateResult = await roomRepository
            .createQueryBuilder()
            .update(Room)
            .set({ name })
            .where('id = :id AND creatorId = :userId', { id: parseInt(id), userId })
            .returning('*')
            .execute();

        if (updateResult.affected === 0) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        res.status(200).json(updateResult.raw[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

RoomController.delete('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const roomRepository = AppDataSource.getRepository(Room);
      
        /*
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });

        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        await roomRepository.remove(room);
        */
        
        const deleteResult = await roomRepository
            .createQueryBuilder()
            .delete()
            .from(Room)
            .where('id = :id AND creatorId = :userId', { id: parseInt(id), userId })
            .execute();

        if (deleteResult.affected === 0) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default RoomController;
