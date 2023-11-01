import { Request, ResponseToolkit } from '@hapi/hapi';
import { User } from '../models/user.model';
import { Sequelize } from 'sequelize';
import { SessionE } from '../entities/session.entity';
import { UserE } from '../entities/user.entity';
import { LikeE } from '../entities/like.entity';
import { NotificationE } from '../entities/notification.entity';
import { ChatModel } from '../models/chat.model';
import { Op } from 'sequelize';
import { Match } from '../models/match.model';
import { createApiLogger } from 'logging-colorify';

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
            const stime = new Date();
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);
            const isActive = await SessionE.ifSessionExists(isUser.id)
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
            const existingLike = await LikeE.ifExistingLike(isUser.id, likedUserId);
            if (existingLike) {
                return h.response({ status: '------- You already liked this user -------' }).code(400);
            }

            if (likedUserId !== isUser.id) {
                await LikeE.createLike(isUser.id, likedUserId);
                const mutualLike = await LikeE.mutualLike(likedUserId, isUser.id);

                if (mutualLike) {
                    const matchId = Math.floor(1000 + Math.random() * 9000);
                    const match = await Match.create({
                        userIds: [isUser.id, likedUserId],
                        matchId: matchId,
                    });
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
                    await NotificationE.createMatchNotification(likedUserId, isUser.id, matchMessage);

                } else {
                    const notificationMessage = `------- ${isUser.fullName}, has a crush on you. -------`;
                    await NotificationE.createLikeNotification(likedUserId, isUser.id, notificationMessage);
                }
            }

            await createApiLogger(request,stime);            
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
            const user = await UserE.ifEmailExists(isUser.email);
            const isActive = await SessionE.ifSessionExists(user.id);
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            const notificationId = request.params.notificationId;
            const notification = await NotificationE.findNotification(notificationId, user.id);

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
            const user = await UserE.ifEmailExists(isUser.email);
            const isActive = await SessionE.ifSessionExists(user.id)
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            await NotificationE.readAllNotification(user.id);

            return h.response({ status: '------- All notifications marked as read -------' }).code(200);
        } catch (error) {
            console.error('!!! Error marking all notifications as read:', error);
            return h.response({ status: '!!! Error marking all notifications as read !!!' }).code(500);
        }
    }

    /***************************************************/
    /**************** Delete Match API *****************/
    /***************************************************/

    static async deleteMatch(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);

            const isActive = await SessionE.ifSessionExists(isUser.id)
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


            if (matchToDelete.userIds && matchToDelete.userIds.length === 2) {
                userIdToDelete = matchToDelete.userIds.find((userId: number) => userId !== isUser.id);

                await LikeE.deleteLike(isUser.id, userIdToDelete);

                await LikeE.deleteLike(userIdToDelete, isUser.id);

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

            const updatedMatches = isUser.matches.filter((match: Match) => match.matchId !== parseInt(matchIdToDelete));

            await isUser.update({ matches: updatedMatches });


            return h.response({ status: '------- Match deleted successfully -------' }).code(200);
        } catch (error) {
            console.error('Error deleting match:', error);
            return h.response({ status: '!!! Error deleting match !!!' }).code(500);
        }
    }

    static async sendMessage(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);
            const isActive = await SessionE.ifSessionExists(isUser.id)
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' });
            }
            const senderId = isUser.id;
            const receiverId = request.params.recieverId;
            if (senderId === receiverId) {
                return h.response({ status: '!!! You cannot send message to self !!!' }).code(403);
            }
            const matchSender = await Match.findOne({
                where: {
                    userIds: [senderId, receiverId],
                },
            });

            console.log('MatchIdSender', matchSender);

            const matchReceiver = await Match.findOne({
                where: {
                    userIds: [receiverId, senderId],
                },
            });


            console.log('MatchIdReciever', matchReceiver);
            if (!matchSender && !matchReceiver) {
                return h.response({ status: '!!! You can only chat with mutual matches !!!' }).code(403);
            }

            const { message } = request.payload as {
                message: string;
            };
            const chat = await ChatModel.create({ senderId, receiverId, message });

            return h.response(chat).code(201);
        } catch (error) {
            console.log("!!! Error Sending Message: ", error);
            return h.response({ status: '!!! Error sending message !!!' }).code(500);
        }
    }

    static async getMessages(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);
            const isActive = await SessionE.ifSessionExists(isUser.id)
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' });
            }
            const senderId = isUser.id;
            const receiverId = request.params.recieverId;
            if (senderId === receiverId) {
                return h.response({ status: '!!! Please enter id of a valid user !!!' }).code(403);
            }

            const messages = await ChatModel.findAll({
                where: {
                    [Op.or]: [{
                        senderId, receiverId
                    },
                    {
                        senderId: receiverId,
                        recieverId: senderId
                    },
                    ],
                },
                order: [['createdAt', 'ASC']],
            });
            return h.response(messages).code(200);
        } catch (error) {
            console.error('Error getting messages:', error);
            return h.response({ status: '!!! Error getting messages !!!' }).code(500);
        }
    }
}

