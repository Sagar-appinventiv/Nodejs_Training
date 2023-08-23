import { ServerRoute } from '@hapi/hapi';
import { UserProfileController } from '../controllers/userProfile.controller';
import Joi from 'joi';

const userProfileRoutes: ServerRoute[] = [
    {
        method:'PUT',
        path: '/update-details',
        handler: UserProfileController.updateUserDetails,
        options: {
            auth: 'user',
            validate: {
                payload: Joi.object({
                    interestedIn: Joi.string().valid('men', 'women').required(),
                    areaLocality: Joi.string().required(),
                    hobbies: Joi.array().items(Joi.string()).required(),
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
            auth: 'user'
        },
    },

    {
        method: 'POST',
        path: '/subscribe',
        handler: UserProfileController.subscribe,
    },

];

export default userProfileRoutes;