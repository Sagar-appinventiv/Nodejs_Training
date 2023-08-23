import { ServerRoute } from '@hapi/hapi';
import { UserFeedController } from '../controllers/userFeed.controller';
import Joi from 'joi';

const userFeedRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/search-users',
        handler: UserFeedController.searchUsers,
        options: {
            auth: 'user',
            validate: {
                query: Joi.object({
                    interestedIn: Joi.string().valid('men', 'women').required(),
                    areaLocality: Joi.string().required(),
                    ageGroup: Joi.string().pattern(/^\d+-\d+$/),
                    hobbies: Joi.alternatives().try(Joi.array().items(Joi.string()),Joi.string()),
                }),
            },
        },
    },
];

export default userFeedRoutes;