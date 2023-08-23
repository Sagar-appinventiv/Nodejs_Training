import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import onboardingRoutes from './src/routes/onboarding.router';
import userSettingsRoutes from './src/routes/userSettings.router';
import { dbConnection } from "./src/database/dbConnection"
import plugin from './src/middlewares/authPlugin.middleware';
import userProfileRoutes from './src/routes/userProfile.router';
import userFeedRoutes from './src/routes/userFeed.router';
import stripeWebhookRoutes from './src/routes/StripeWebhook.router';
import { UserProfileController } from './src/controllers/userProfile.controller';
import likeRoutes from './src/routes/like.router';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { User } from './src/models/user.model';
import { Like } from './src/models/like.model';
import { Notification } from './src/models/notification.model';
import { Session } from './src/models/session.model';

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
    });

    await dbConnection();
    await server.register(plugin);

    server.route(onboardingRoutes);
    server.route(userSettingsRoutes);
    server.route(userProfileRoutes);
    server.route(userFeedRoutes);
    server.route(stripeWebhookRoutes);
    server.route(likeRoutes)
    // server.route({
    //     method: 'POST',
    //     path: '/user/check-subscription',
    //     handler: UserProfileController.subscribe,
    // });

    const app = express();
    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', async (roomId) => {
            const [user1Id, user2Id] = roomId.split('_').slice(1);
            const areUsersMatched = await Like.isMatch(user1Id, user2Id);

            if(areUsersMatched) {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            }else {
                console.log(`User ${socket.id} is not allowed to join room ${roomId}`);
            }
        });

        socket.on('privateMessage', ({roomId, message})=>{
            io.to(roomId).emit('privateMessage', {
                sender: socket.id,
                message: message,
            });
            console.log(`Private message sent in room ${roomId}: ${message}`);
        });
        socket.on('disconnect', ()=>{
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    httpServer.listen(3010, () => {
        console.log('Socket.io server is running on port 3001');
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (error) => {
    console.error('!!! Error starting server: ', error);
    process.exit(1);
});

init();
