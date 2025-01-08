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
        return
    }

    try {
        //         const messageRepository = AppDataSource.getRepository(Message);
//         const messages = await messageRepository.find({
//             where: [
//                 { sender: { id: senderId }, recipient: { id: recipientId } },
//                 { sender: { id: recipientId }, recipient: { id: senderId } }
//             ],
//             order: { createdAt: 'ASC' }
//         });
        const messages = await AppDataSource.getRepository(Message)
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.recipient', 'recipient')
            .where(
                `(message.senderId = :senderId AND message.recipientId = :recipientId) OR 
                 (message.senderId = :recipientId AND message.recipientId = :senderId)`,
                { senderId, recipientId }
            )
            .orderBy('message.createdAt', 'ASC')
            .getMany();

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching message history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


MessageController.post('/', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { roomId, message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User is not authenticated' });
        return
    }

    if (!roomId || !message) {
        res.status(400).json({ message: 'Bad Request: Missing roomId or message' });
        return
    }

    try {
        //         const messageRepository = AppDataSource.getRepository(Message);
//         const newMessage = messageRepository.create({
//             content: message,
//             room: { id: roomId },
//             sender: { id: userId }
//         });

        const newMessage = await AppDataSource.getRepository(Message)
            .createQueryBuilder()
            .insert()
            .into(Message)
            .values({
                content: message,
                room: { id: roomId },
                sender: { id: userId },
            })
            // get the saved message immediately after creation.
            .returning('*') 
            .execute();

        const savedMessage = newMessage.generatedMaps[0];

        io.to(roomId.toString()).emit('newMessage', savedMessage);

        res.status(201).json({ data: savedMessage, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving new message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


MessageController.get('/:roomId', verifyToken, async (req: CustomRequest, res: Response): Promise<void> => {
    const { roomId } = req.params;

    const parsedRoomId = parseInt(roomId);
    if (isNaN(parsedRoomId)) {
        res.status(400).json({ message: 'Invalid roomId' });
        return
    }

    try {
        //         const messageRepository = AppDataSource.getRepository(Message);
//         const messages = await messageRepository.find({
//             where: { room: { id: parsedRoomId } },
//             order: { createdAt: 'ASC' }
//         });

        const messages = await AppDataSource.getRepository(Message)
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.room', 'room')
            .where('message.roomId = :roomId', { roomId: parsedRoomId })
            .orderBy('message.createdAt', 'ASC')
            .getMany();

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages for room:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default MessageController;



