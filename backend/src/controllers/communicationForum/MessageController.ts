import express, { Response } from 'express';
import { io } from '../../app';
import { AppDataSource } from '../../config/data-source';
import { CustomRequest, verifyToken } from '../../middlewares/Authmidlewares/IsAuthenticated';
import { Message } from '../../models/Message';
const MessageController = express.Router();


MessageController.get('/history/:recipientId', verifyToken, async (req: CustomRequest, res: Response) => {
    const senderId = req.user?.id;
    const { recipientId } = req.params;

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
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

MessageController.post('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { roomId, message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const messageRepository = AppDataSource.getRepository(Message);
        const newMessage = messageRepository.create({
            content: message,
            room: { id: roomId },
            sender: { id: userId }
        });

        await messageRepository.save(newMessage);

        io.to(roomId).emit('newMessage', newMessage);

        res.status(201).json({ data: newMessage, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

MessageController.get('/:roomId', verifyToken, async (req: CustomRequest, res: Response) => {
    const { roomId } = req.params;
    const ParsedId = parseInt(roomId)

    try {
        const messageRepository = AppDataSource.getRepository(Message);
        const messages = await messageRepository.find({
            where: { room: { id: ParsedId } },
            order: { createdAt: 'ASC' }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default MessageController;
