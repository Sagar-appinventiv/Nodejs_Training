import { ServerRoute } from '@hapi/hapi';
import { LikeController } from '../controllers/like.controller';

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
            validate:{
                options:{
                    allowUnknown:true,
                    security:[{ apiKey:[] }]
                }
            },
            auth: 'user',
        },
    },

    {
        method:'POST',
        path: '/notifications/mark-all-read',
        handler: async (request, h) => {
            return await LikeController.markAllNotificationsAsRead(request, h);
        },
        options: {
            auth: 'user',
            tags: ['api','User profile APIs'],
            description: 'Mark all notifications as read',
            validate: {
                options:{
                    allowUnknown: true,
                    security: [{ apiKey:[] }]
                }
            }
        }
    },

    {
        method:'POST',
        path:'/notifications/{notificationId}/mark-read',
        handler: async (request, h) => {
            return await LikeController.markSingleNotificationAsRead(request, h);
        },
        options:{
            auth: 'user',
            tags: ['api','User profile APIs'],
            description: 'Mark single notification as read',
            validate: {
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/deleteMatch/{matchId}',
        handler: LikeController.deleteMatch,
        options: {
            tags: ['api','User profile APIs'],
            description: 'Deleting the match',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: []}]
                }
            },
            auth: 'user'
        }
      },
];

export default likeRoutes;
