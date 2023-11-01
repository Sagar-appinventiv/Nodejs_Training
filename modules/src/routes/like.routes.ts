import { ServerRoute } from '@hapi/hapi';
import { LikeController } from '../controllers/like.controller';
import Joi from 'joi';
import { Like } from '../models/like.model';

const likeRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/like/{likedUserId}',
        handler: async (request, h) => {
            return await LikeController.likeUser(request, h);
        },
        options: {
            tags: ['api', 'User feed APIs'],
            description: 'Like API',
            validate: {
                params: Joi.object({
                    likedUserId: Joi.number().required(),
                }),
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }]
                }
            },
            auth: 'user',
        },
    },

    {
        method: 'POST',
        path: '/notifications/mark-all-read',
        handler: async (request, h) => {
            return await LikeController.markAllNotificationsAsRead(request, h);
        },
        options: {
            auth: 'user',
            tags: ['api', 'User profile APIs'],
            description: 'Mark all notifications as read',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }]
                }
            }
        }
    },

    {
        method: 'POST',
        path: '/notifications/{notificationId}/mark-read',
        handler: async (request, h) => {
            return await LikeController.markSingleNotificationAsRead(request, h);
        },
        options: {
            auth: 'user',
            tags: ['api', 'User profile APIs'],
            description: 'Mark single notification as read',
            validate: {
                params: Joi.object({
                    notificationId: Joi.number().required(),
                }),
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }]
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/deleteMatch/{matchId}',
        handler: LikeController.deleteMatch,
        options: {
            tags: ['api', 'User profile APIs'],
            description: 'Deleting the match',
            validate: {
                params: Joi.object({
                    matchId: Joi.number().required(),
                }),
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }]
                }
            },
            auth: 'user'
        }
    },

    {
        method: 'POST',
        path: '/api/chats/{recieverId}',
        handler: LikeController.sendMessage,
        options: {
            auth: 'user'
        }
    },

    {
        method: 'GET',
        path: '/api/chats/{recieverId}',
        handler: LikeController.getMessages,
        options: {
            auth: 'user'
        }
    }
];

export default likeRoutes;
