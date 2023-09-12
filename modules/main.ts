import Hapi, { ServerRoute } from '@hapi/hapi';
import dotenv from 'dotenv';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import hapiSwagger from 'hapi-swagger';
import onboardingRoutes from './src/routes/onboarding.routes';
import userSettingsRoutes from './src/routes/userSettings.routes';
import { dbConnection } from "./src/database/dbConnection";
import authPlugin from './src/middlewares/authPlugin.middleware';
import userProfileRoutes from './src/routes/userProfile.routes';
import userFeedRoutes from './src/routes/userFeed.routes';
import stripeWebhookRoutes from './src/routes/StripeWebhook.routes';
import { ViewRoute } from './src/routes/view.routes';
import likeRoutes from './src/routes/like.routes';
import path from "path";
import { syncModelsSequentially } from './src/models/index.models';

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
    });

    await dbConnection();
    await syncModelsSequentially();

    await server.register(authPlugin);
    await server.register([inert, vision]);
    await server.register([{
        plugin: hapiSwagger,
        options: {
            info: {
                title: 'SoulSync Documentation',
                version: '1.0.0',
            },
            securityDefinitions: {
                apiKey: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header'
                }
            },
            security: [{ apiKey: [] }],
            grouping: 'tags',
            tags: [
                { name: 'User onboading APIs'},
                { name: 'User profile APIs'},
                { name: 'Payment related APIs'},
                { name: 'User feed APIs'},
                { name: 'User settings APIs'},


            ],
        }
    },
    ])

    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: path.join(__dirname, '..'),
        path: 'view'
    });

    server.route(ViewRoute as ServerRoute[]);
    server.route(onboardingRoutes);
    server.route(userSettingsRoutes);
    server.route(userProfileRoutes);
    server.route(userFeedRoutes);
    server.route(stripeWebhookRoutes);
    server.route(likeRoutes);

    server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, '..', 'view'),
                listing: false,
                index: false
            }
        },
        options: {
            auth: false
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/private-chat',
    //     handler: async (request, h) => {
    //         const filePath = path.join(__dirname, '../private_chat.html');
    //         return h.file(filePath);
    //     },
    //     options: {
    //         auth: false,
    //     },
    // });

    // const io = new Server(server.listener);

    // io.on('connection', async (socket) => {
    //     console.log(`User connected: ${socket.id}`);
    //     socket.on('startPrivateChat', async (matchUserId) => {
    //         try {
    //             const token = socket.handshake.auth.token;
    //             if (!token) {
    //                 console.log('No token found in socket auth.');
    //                 return;
    //             }

    //             const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
    //             const userId = decodedToken.id;

    //             const userMatches = await Like.findAll({
    //                 where: { likerId: userId, likedUserId: matchUserId },
    //                 attributes: ['likedUserId'],
    //             });

    //             if (userMatches.length > 0) {
    //                 const roomId = `room_${userId}_${matchUserId}`;
    //                 socket.join(roomId);
    //                 console.log(`User ${userId} started a private chat with ${matchUserId}`);
    //             } else {
    //                 console.log(`User ${userId} does not have a match with ${matchUserId}`);
    //             }
    //         } catch (error) {
    //             console.log("Error decoding token:", error);
    //         }
    //     });

    //     socket.on('privateMessage', ({ roomId, message }) => {
    //         io.to(roomId).emit('privateMessage', {
    //             sender: socket.id,
    //             message: message,
    //         });
    //         console.log(`Private message sent in room ${roomId}: ${message}`);
    //     });

    //     socket.on('disconnect', () => {
    //         console.log(`User disconnected: ${socket.id}`);
    //     });
    // });

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (error) => {
    console.error('!!! Error starting server: ', error);
    process.exit(1);
});

init();
