import { ServerRoute } from '@hapi/hapi';
import { LikeController } from '../controllers/like.controller';

const likeRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/like/{likedUserId}',
        handler: (request,h) => {
            return LikeController.likeUser(request,h);
        },
        options: {
            auth: 'user',
        },
    },
];

export default likeRoutes;
