// import { ServerRoute } from '@hapi/hapi';
// import { UserSettingsController } from '../controllers/userSettings.controller';

// const userSettingsRoutes: ServerRoute[] = [{
//     method: 'POST',
//     path: '/edit-password',
//     handler: UserSettingsController.editPassword,
//     options: {
//         auth: 'user'
//     }
// },

// {
//     method: 'DELETE',
//     path: '/delete-account',
//     handler: UserSettingsController.deleteAccount,
//     options: {
//         auth: 'user'
//     }
// },

// {
//     method: 'POST',
//     path: '/set-profilePicture',
//     handler: (request, h) => {
//         return UserSettingsController.setProfilePicture(request, h);
//     },
//     options: {
//         auth: 'user',
//         payload: {
//             output: 'stream',
//             parse: true,
//             multipart: {
//                 output: 'stream'
//             },
//             allow: 'multipart/form-data',

//         }
//     }
// },

// {
//     method: 'POST',
//     path: '/set-gallery-photos',
//     handler: (request, h) => {
//         return UserSettingsController.setGalleryPhotos(request, h);
//     },
//     options: {
//         auth: 'user',
//         payload: {
//             output: 'stream',
//             parse: true,
//             allow: 'multipart/form-data',
//             multipart: {
//                 output: 'stream',
//             },
//         },
//     },
// },

// ];

// export default userSettingsRoutes;
import { ServerRoute } from '@hapi/hapi';
import { UserSettingsController } from '../controllers/userSettings.controller';
import Joi from 'joi';

const userSettingsRoutes: ServerRoute[] = [{
    method: 'POST',
    path: '/edit-password',
    handler: async (request, h) => {
        return await UserSettingsController.editPassword(request, h);
    },
    options: {
        tags: ['api','User settings APIs'],
        description: 'Edit password API',
        validate: {
            payload: Joi.object({
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().required(),
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
    method: 'GET',
    path: '/delete-account',
    handler: async (request, h) => {
        return await UserSettingsController.deleteAccount(request, h);
    },
    options: {
        tags: ['api','User settings APIs'],
        description: 'Delete account API',
        validate: {
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
    path: '/set-profilePicture',
    handler: async (request, h) => {
        return await UserSettingsController.setProfilePicture(request, h);
    },
    options: {
        tags: ['api','User settings APIs'],
        description: 'Set profile picture API',
        validate: {
            options: {
                allowUnknown: true,
                security: [{ apiKey: [] }]
            }
        },
        auth: 'user',
        payload: {
            output: 'stream',
            parse: true,
            multipart: {
                output: 'stream'
            },
            allow: 'multipart/form-data',

        }
    }
},

{
    method: 'POST',
    path: '/set-gallery-photos',
    handler: async (request, h) => {
        return await UserSettingsController.setGalleryPhotos(request, h);
    },
    options: {
        tags: ['api','User settings APIs'],
        description: 'Insert photos into gallery API',
        validate: {
            options: {
                allowUnknown: true,
                security: [{ apiKey: [] }]
            }
        },
        auth: 'user',
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: {
                output: 'stream',
            },
        },
    },
},

];

export default userSettingsRoutes;
