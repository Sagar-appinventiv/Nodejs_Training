import http from 'http';
import { Server, Socket } from 'socket.io';
import { ChatModel } from './src/models/chat.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from './src/models/user.model';
import { Match } from './src/models/match.model';

dotenv.config();
const server = http.createServer();

const io = new Server(server);

const socketIdByUserId: { [userId: number]: string } = {};

class CustomSocket extends Socket {
    userId?: number;
    receiverId?: number;
    receiverSocketid?: string;
    matchId?: number | null;
}

io.use(async (socket: CustomSocket, next) => {
    try {
        const token = socket.handshake.headers.authorization;

        if (!token) {
            return next(new Error('Authentication failed. Token missing.'));
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { email: string };

        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return next(new Error('Authentication failed. User not found.'));
        }

        socket.userId = user.id;
        const receiverIdParam = socket.handshake.query.receiverId;
        if (!receiverIdParam) {
            return next(new Error('Invalid receiverId parameter.'));
        }

        socket.receiverId = parseInt(receiverIdParam as string, 10);
        socket.matchId = await checkMatch(user.id, socket.receiverId);
        console.log('Socket.matchID:', socket.matchId);

        if (socket.matchId === null) {
            return next(new Error("You don't have a match to chat with."));
        }
        console.log(`User ID: ${socket.userId}, Receiver ID: ${socket.receiverId}`);

        socketIdByUserId[user.id] = socket.id;

        next();
    } catch (error) {
        console.error('Error during authentication:', error);
    }
});

io.on('connection', (socket: CustomSocket) => {
    console.log(`User ${socket.userId} is connected with socket ID ${socket.id}`);

    socket.on('disconnect', () => {
        for (const userId in socketIdByUserId) {
            if (socketIdByUserId[userId] === socket.id) {
                delete socketIdByUserId[userId];
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });

    if (socket.receiverId !== socket.userId) {
        socket.on('private-chat', async ({ message }: { message: string }) => {
            try {

                if (socket.matchId === null) {
                    console.log("You dont have a match to chat");
                    return;
                }
                const receiverId = socket.receiverId;
                const senderId = socket.userId;
                const chat = await ChatModel.create({
                    senderId,
                    receiverId,
                    message,
                });

                if (receiverId !== undefined) {
                    const receiverSocketId = socketIdByUserId[receiverId];
                    if (receiverSocketId) {
                        if (typeof receiverSocketId === 'string') {
                            const chatMessage = chat.message;
                            io.to(receiverSocketId).emit('private-chat', chatMessage);
                        } else {
                            console.error('Invalid receiver socket ID:', receiverSocketId);
                        }
                    } else {
                        console.log(`Receiver's socket ID not found for user ID: ${receiverId}`);
                    }
                } else {
                    console.log('Receiver ID is undefined, cannot send the message.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

const port = process.env.SOCKET_PORT;
server.listen(port, () => {
    console.log(`Socket.io server listening on port : ${port}`);
});

async function checkMatch(senderId: number, receiverId: number): Promise<number | null> {
    try {
        const user1 = await Match.findOne({
            where: {
                userIds: [senderId, receiverId],
            },
        });

        const user2 = await Match.findOne({
            where: {
                userIds: [receiverId, senderId],
            },
        });

        if (user1 || user2) {
            console.log('Match found.');
            return user1 ? user1.id : user2.id;
        } else {
            console.log('Match not found.');
            return null;
        }
    } catch (error) {
        console.error('Error while checking for a match:', error);
        return null;
    }
}