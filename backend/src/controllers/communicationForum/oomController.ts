import express, { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Room } from '../../models/Room';

export const RoomController = express.Router();

// Create a new room
RoomController.post('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const roomRepository = AppDataSource.getRepository(Room);
        const newRoom = roomRepository.create({
            name,
            description,
            creator: { id: userId }
        });

        await roomRepository.save(newRoom);
        res.status(201).json(newRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all rooms
RoomController.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const roomRepository = AppDataSource.getRepository(Room);
        const rooms = await roomRepository.find({ relations: ['creator'] });
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
        const room = await roomRepository.findOne({ where: { id: parseInt(id) }, relations: ['creator', 'posts'] });

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

// Update a room
RoomController.put('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.id;

    try {
        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });

        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        room.name = name || room.name;

        await roomRepository.save(room);
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a room
RoomController.delete('/:id', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const roomRepository = AppDataSource.getRepository(Room);
        const room = await roomRepository.findOne({ where: { id: parseInt(id), creator: { id: userId } } });

        if (!room) {
            res.status(404).json({ message: 'Room not found or not authorized' });
            return;
        }

        await roomRepository.remove(room);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default RoomController;
