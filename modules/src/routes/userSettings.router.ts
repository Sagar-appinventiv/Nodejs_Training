import { ServerRoute } from '@hapi/hapi';
import { UserSettingsController } from '../controllers/userSettings.controller';

const userSettingsRoutes: ServerRoute[] = [{
    method: 'POST',
    path: '/edit-password',
    handler: UserSettingsController.editPassword,
    options: {
        auth: 'user'
    }
},

{
    method: 'DELETE',
    path: '/delete-account',
    handler: UserSettingsController.deleteAccount,
    options: {
        auth: 'user'
    }
},

{
    method:'POST',
    path:'/set-profilePicture',
    handler: (request, h) => {
        return UserSettingsController.setProfilePicture(request , h);
    },
    options: {
        auth: 'user',
        payload: {
            output:'stream',
            parse: true,
            // multipart: true,
            allow: 'multipart/form-data',
            
        }
    }
}
];

export default userSettingsRoutes;