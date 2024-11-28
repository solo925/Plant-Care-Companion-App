"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const socket_io_1 = require("socket.io");
const data_source_1 = require("../src/config/data-source");
const IsAuthenticated_1 = require("./middlewares/Authmidlewares/IsAuthenticated");
const Message_1 = require("./models/Message");
const main_1 = __importDefault(require("./routes/main"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log("Data Source has been initialized!");
    const testConnection = await data_source_1.AppDataSource.query("SELECT 1;");
    console.log("Connection test query result:", testConnection);
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});
exports.io = io;
const activeUsers = new Map();
async function getUserSocketId(userId) {
    return activeUsers.get(userId) || null;
}
io.use(IsAuthenticated_1.verifyToken);
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.auth.userId;
    if (userId) {
        activeUsers.set(userId, socket.id);
    }
    socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        const messageRepository = data_source_1.AppDataSource.getRepository(Message_1.Message);
        const messages = await messageRepository.find({
            where: { room: { id: roomId } },
            relations: ['masageuser', 'room'],
            order: { createdAt: 'ASC' }
        });
        socket.emit('loadMessages', messages);
    });
    socket.on('sendMessageToRoom', async (data) => {
        const { roomId, message, userId } = data;
        try {
            const messageRepository = data_source_1.AppDataSource.getRepository(Message_1.Message);
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
        }
        catch (error) {
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
app.use('/api/v1', main_1.default);
exports.default = app;
