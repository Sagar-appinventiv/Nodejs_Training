import { ServerRoute } from '@hapi/hapi';
import { UserFeedController } from '../controllers/userFeed.controller';
import Joi from 'joi';

const userFeedRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/search-users',
        handler: UserFeedController.searchUsers,
        options: {
            tags: ['api','User feed APIs'],
            description: 'Search Users API',
            notes: 'This API allows users to search other users based on several filters',
            auth: 'user',
            validate: {
                query: Joi.object({
                    interestedIn: Joi.string().valid('men', 'women').required(),
                    areaLocality: Joi.string().required(),
                    ageGroup: Joi.string().pattern(/^\d+-\d+$/),
                    hobbies: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
                }),
                options: {
                    allowUnknown:true,
                    security:[{ apiKey:[] }]
                }
            },
        },
    },

    {
        method: 'POST',
        path: '/block/{blockedUserId}',
        handler: UserFeedController.blockUser,
        options: {
            auth: 'user',
            tags: ['api','User feed APIs'],
            description: 'Block an user API',
            validate: {
                options: {
                    allowUnknown:true,
                    security:[{ apiKey:[] }]
                }
            }
        }
    },

    {
        method: 'DELETE',
        path: '/removeBlockedUser/{userId}',
        handler: UserFeedController.removeBlockedUser,
        options: {
            auth:'user'
        }
    }
];

export default userFeedRoutes;