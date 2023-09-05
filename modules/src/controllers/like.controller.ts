import { Request, ResponseToolkit } from '@hapi/hapi';
import { Like } from '../models/like.model';
import { User } from '../models/user.model';
import { Notification } from '../models/notification.model';
import { Session } from '../models/session.model';
import { Sequelize, Op } from 'sequelize';

interface Match {
    matchId: number;
    userIds: number[];
}

export class LikeController {
    /***************************************************/
    /********************* Like API ********************/
    /***************************************************/
    static async likeUser(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: user.email } });
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            const likedUserId = request.params.likedUserId;

            const likedUser = await User.findByPk(likedUserId);
            if (!likedUser) {
                return h.response({ status: '!!! Liked user not found !!!' }).code(404);
            }
            const existingLike = await Like.findOne({
                where: {
                    likerId: isUser.id,
                    likedUserId: likedUserId,
                },
            });
            if (existingLike) {
                return h.response({ status: '------- You already liked this user -------' }).code(400);
            }
            if (likedUserId !== isUser.id) {
                await Like.create({ likerId: isUser.id, likedUserId });
                const notificationMessage = `------- ${isUser.fullName}, has a crush on you. -------`;
                const newNotification = await Notification.create({
                    userId: likedUserId,
                    senderId: isUser.id,
                    type: 'like',
                    message: notificationMessage,
                });
            }
            const mutualLike = await Like.findOne({
                where: {
                    likerId: likedUserId,
                    likedUserId: isUser.id,
                },
            });

            if (mutualLike) {
                const matchId = Math.floor(1000 + Math.random() * 9000);
                await User.update(
                    {
                        matches: Sequelize.literal(`array_append(matches, '{"matchId": ${matchId}, "userIds": [${isUser.id}, ${likedUserId}]}'::jsonb)`),
                    },
                    {
                        where: {
                            id: [isUser.id, likedUserId],
                        },
                    }
                );
                const matchMessage = `------- Congratulations, you got a new match, ${isUser.fullName} -------`;
                await Notification.create({
                    userId: likedUserId,
                    senderId: isUser.id,
                    type: 'match',
                    message: matchMessage,
                });
            }

            return h.response({ status: '------- Liked user successfully -------' }).code(200);
        } catch (error) {
            console.error('Error liking user:', error);
            return h.response({ status: '!!! Error liking user !!!' }).code(500);
        }
    }

    /***************************************************/
    /********* Mark Single Notification as API *********/
    /***************************************************/
    static async markSingleNotificationAsRead(request: Request, h: ResponseToolkit) {
        try {
            const isUser: any = request.auth.credentials;
            const user = await User.findOne({ where: { email: isUser.email } });
            const isActive = await Session.findOne({ where: { userId: user.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            const notificationId = request.params.notificationId;
            const notification = await Notification.findOne({
                where: {
                    id: notificationId,
                    userId: user.id
                }
            });

            if (!notification) {
                return h.response({ status: '!!! Notification not found !!!' }).code(404);
            }

            if (notification.isRead) {
                return h.response({ status: '------- Notification is already marked as read -------' }).code(400);
            }
            // await notification.update({isRead:true})
            notification.isRead = true;
            await notification.save();

            return h.response({ status: '------- Notification marked as read -------' }).code(200);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return h.response({ status: '!!! Error marking notification as read !!!' }).code(500);
        }
    }

    /***************************************************/
    /******** Mark All Notifications as Read API *******/
    /***************************************************/
    static async markAllNotificationsAsRead(request: Request, h: ResponseToolkit) {
        try {
            const isUser: any = request.auth.credentials;
            const user = await User.findOne({ where: { email: isUser.email } })
            const isActive = await Session.findOne({ where: { userId: user.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            await Notification.update(
                { isRead: true },
                { where: { userId: user.id, isRead: false } }
            );

            return h.response({ status: '------- All notifications marked as read -------' }).code(200);
        } catch (error) {
            console.error('!!! Error marking all notifications as read:', error);
            return h.response({ status: '!!! Error marking all notifications as read !!!' }).code(500);
        }
    }

    /***************************************************/
    /**************** Delete Match API ******************/
    /***************************************************/

    static async deleteMatch(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: user.email } });

            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' });
            }

            const matchIdToDelete = request.params.matchId;
            const matchToDelete = isUser.matches.find((match: Match) => match.matchId === parseInt(matchIdToDelete));

            if (!matchToDelete) {
                console.log('Match not found. Match ID:', matchIdToDelete);

                return h.response({ status: '!!! Match not found !!!' }).code(404);
            }

            let userIdToDelete;

            // // Delete match data from the Like model for both users first

            if (matchToDelete.userIds && matchToDelete.userIds.length === 2) {
                userIdToDelete = matchToDelete.userIds.find((userId: number) => userId !== isUser.id);

                // Delete like data for the current user
                await Like.destroy({
                    where: {
                        likerId: isUser.id,
                        likedUserId: userIdToDelete,
                    },
                });

                // Delete like data for the liked user
                await Like.destroy({
                    where: {
                        likerId: userIdToDelete,
                        likedUserId: isUser.id,
                    },
                });

                // Continue with deleting match data from user tables
                // const updatedMatches = isUser.matches.filter((match: Match) => match.matchId !== parseInt(matchIdToDelete));

                // await isUser.update({ matches: updatedMatches });

                // const userToDelete = await User.findByPk(userIdToDelete);

                // if (userToDelete) {
                //     const updatedMatchesUser2 = userToDelete.matches.filter((match: Match) => match.matchId !== parseInt(matchIdToDelete));
                //     await userToDelete.update({ matches: updatedMatchesUser2 });
                // }

                // // Delete the match data from the liked user's matches array
                // const likedUserId = matchToDelete.userId.find((userId: number) => userId !== isUser.id);
                // const likedUser = await User.findByPk(likedUserId);

                // if (likedUser) {
                //     const updatedLikedUserMatches = likedUser.matches.filter((match: Match) => match.matchId !== matchIdToDelete);
                //     await likedUser.update({ matches: updatedLikedUserMatches });
                // }
                const likedUser = await User.findByPk(userIdToDelete);

                if (likedUser) {
                    const updatedLikedUserMatches = likedUser.matches.filter((match: Match) => match.matchId !== parseInt(matchIdToDelete));
                    await likedUser.update({ matches: updatedLikedUserMatches });
                }
            }

            // Continue with deleting match data from the current user's matches array
            const updatedMatches = isUser.matches.filter((match: Match) => match.matchId !== parseInt(matchIdToDelete));

            await isUser.update({ matches: updatedMatches });


            return h.response({ status: '------- Match deleted successfully -------' }).code(200);
        } catch (error) {
            console.error('Error deleting match:', error);
            return h.response({ status: '!!! Error deleting match !!!' }).code(500);
        }
    }
}    