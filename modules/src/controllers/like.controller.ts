import { Request, ResponseToolkit } from '@hapi/hapi';
import { Like } from '../models/like.model';
import { User } from '../models/user.model';
import { Notification } from '../models/notification.model';
import { Session } from '../models/session.model';

export class LikeController {
    static async likeUser(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: user.email } });
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            const likedUserId = request.params.likedUserId;

            const likedUser = await User.findByPk(likedUserId);
            if (!likedUser) {
                return h.response({ status: 'Liked user not found' }).code(404);
            }
            const existingLike = await Like.findOne({
                where: {
                    likerId: isUser.id,
                    likedUserId: likedUserId,
                },
            });

            if (existingLike) {
                return h.response({ status: 'You already liked this user' }).code(400);
            }
            if (likedUserId !== isUser.id) {
            await Like.create({ likerId: isUser.id, likedUserId });
                const notificationMessage = `${isUser.fullName}, has a crush on you.`;
                await Notification.create({
                    userId: likedUserId,
                    senderId: isUser.id,
                    type: 'like',
                    message: notificationMessage,
                });
            }
            const isMatch = await Like.isMatch(isUser.id, likedUserId);

            if (isMatch) {
                const existingMatchNotification = await Notification.findOne({
                    where: {
                        userId: likedUserId,
                        senderId: isUser.id,
                        type: 'match',
                    },
                });

                if (!existingMatchNotification) {

                    const matchMessage = `Congratulations, you got a new match, ${isUser.fullName}`;
                    await Notification.create({
                        userId: likedUserId,
                        senderId: isUser.id,
                        type: 'match',
                        message: matchMessage,
                    });
                }
            }
            return h.response({ status: 'Liked user successfully' }).code(200);
        } catch (error) {
            console.error('Error liking user:', error);
            return h.response({ status: 'Error liking user' }).code(500);
        }
    }
}
