import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import "reflect-metadata";
import { Server } from "socket.io";
import { AppDataSource } from "../src/config/data-source";
import { verifyToken } from "./middlewares/Authmidlewares/IsAuthenticated";
import { Message } from "./models/Message";
import mainRoute from "./routes/main";
import configureCors from "./config/corConfig";

const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//     // credentials: true,  // allow cookies if using them
// }));
app.use(configureCors())
app.use(cookieParser());


app.use(express.json());

app.use('/uploads', express.static('uploads'));

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        const testConnection = await AppDataSource.query("SELECT 1;");
        console.log("Connection test query result:", testConnection);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

const server = http.createServer(app);
const io = new Server(server,
    {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        // credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    }
}
);

const activeUsers = new Map<number, string>();


async function getUserSocketId(userId: number): Promise<string | null> {
    return activeUsers.get(userId) || null;
}

io.use(verifyToken);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.auth.userId;
    if (userId) {
        activeUsers.set(userId, socket.id);
    }

    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);


        const messageRepository = AppDataSource.getRepository(Message);
        // const messages = await messageRepository.find({
        //     where: { room: { id: roomId } },
        //     relations: ['masageuser', 'room'],
        //     order: { createdAt: 'ASC' }
        // });

        const messages = await messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.masageuser', 'user')
        .leftJoinAndSelect('message.room', 'room')
        .where('message.roomId = :roomId', { roomId })
        .orderBy('message.createdAt', 'ASC')
        .getMany();


        socket.emit('loadMessages', messages);
    });


    socket.on('sendMessageToRoom', async (data) => {
        const { roomId, message, userId } = data;

        try {
            const messageRepository = AppDataSource.getRepository(Message);
            const newMessage = messageRepository.create({
                content: message,
                masageuser: { id: userId },
                room: { id: roomId }
            });
            await messageRepository.save(newMessage);

            io.to(roomId).emit('receiveMessageFromRoom', {
                message: newMessage.content,
                userId: newMessage.masageuser.id,
                roomId: newMessage.room.id,
                createdAt: newMessage.createdAt,
            });

            console.log(`Message sent to room ${roomId}: ${message}`);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', 'Could not send message');
        }
    });


    socket.on('sendPrivateMessage', async (data) => {
        const { recipientId, message, senderId } = data;
        const recipientSocketId = await getUserSocketId(recipientId);

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receivePrivateMessage', { senderId, message });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (userId) {
            activeUsers.delete(userId);
        }
    });
});

export { io };



app.use('/api/v1', mainRoute);

export default app;
