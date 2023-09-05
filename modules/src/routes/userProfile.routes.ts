import { ServerRoute } from '@hapi/hapi';
import { UserProfileController } from '../controllers/userProfile.controller';
import Joi from 'joi';

const userProfileRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/update-details',
        handler: UserProfileController.updateUserDetails,
        options: {
            tags: ['api', 'User profile APIs'],
            description: 'Update user details API',
            notes: 'This API allows users to update their details',
            auth: 'user',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }],
                },
                payload: Joi.object({
                    interestedIn: Joi.string().valid('men', 'women').required(),
                    areaLocality: Joi.string().required(),
                    // hobbies: Joi.array().items(Joi.string()).required(),
                    mobileNo: Joi.string().required(),
                    dateOfBirth: Joi.string().isoDate().required(),
                    gender: Joi.string().valid('male', 'female').required(),
                }),
            },
        },
    },


    {
        method: 'GET',
        path: '/view-own-profile',
        handler: UserProfileController.viewOwnProfile,
        options: {
            tags: ['api', 'User profile APIs'],
            description: 'View own profile API',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }],
                },
            },
            auth: 'user',
        },
    },

    {
        method: 'GET',
        path: '/api/user/{userId}',
        handler: UserProfileController.viewUserProfile,
        options: {
            tags: ['api', 'User profile APIs'],
            description: 'View own profile API',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }],
                },
            },
            auth: 'user',
        },
    },

    {
        method: 'POST',
        path: '/subscribe',
        handler: UserProfileController.subscribe,
        options: {
            tags: ['api', 'Payment related APIs'],
            description: 'Subscription API',
            validate: {
                options: {
                    allowUnknown: true,
                    security: [{ apiKey: [] }],
                },
            },
            auth: 'user',
        }
    }

];

export default userProfileRoutes;