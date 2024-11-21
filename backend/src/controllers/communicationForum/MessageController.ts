import express, { Response } from 'express';
import { io } from '../../app';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Message } from '../../models/Message';

const MessageController = express.Router();


MessageController.get('/history/:recipientId', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const senderId = req.user?.id;
    const { recipientId } = req.params;

    if (!senderId) {
        res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
    }

    try {
        const messageRepository = AppDataSource.getRepository(Message);
        const messages = await messageRepository.find({
            where: [
                { sender: { id: senderId }, recipient: { id: recipientId } },
                { sender: { id: recipientId }, recipient: { id: senderId } }
            ],
            order: { createdAt: 'ASC' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching message history:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


MessageController.post('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { roomId, message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
    }

    if (!roomId || !message) {
        res.status(400).json({ message: 'Bad Request: Missing roomId or message' });
    }

    try {
        const messageRepository = AppDataSource.getRepository(Message);
        const newMessage = messageRepository.create({
            content: message,
            room: { id: roomId },
            sender: { id: userId }
        });

        await messageRepository.save(newMessage);


        io.to(roomId.toString()).emit('newMessage', newMessage);

        res.status(201).json({ data: newMessage, message: 'Message sent successfully' });
    } catch (error) {
        console.error("Error saving new message:", error);
        res.status(500).json({ message: 'Server error' });
    }
});


MessageController.get('/:roomId', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { roomId } = req.params;

    const parsedRoomId = parseInt(roomId);
    if (isNaN(parsedRoomId)) {
        res.status(400).json({ message: 'Invalid roomId' });
    }

    try {
        const messageRepository = AppDataSource.getRepository(Message);
        const messages = await messageRepository.find({
            where: { room: { id: parsedRoomId } },
            order: { createdAt: 'ASC' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages for room:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default MessageController;
