import { Request, ResponseToolkit } from '@hapi/hapi';
import { Op } from 'sequelize';
import { UserE } from '../entities/user.entity';
import { SessionE } from '../entities/session.entity';
import { LikeE } from '../entities/like.entity';
import { createApiLogger } from 'logging-colorify';


export class UserFeedController {
    /***************************************************/
    /****************** Search Users API ***************/
    /***************************************************/
    static async searchUsers(request: Request, h: ResponseToolkit) {
        try {
            const stime = new Date();
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email)
            const isActive = await SessionE.ifSessionExists(isUser.id);
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }

            const { interestedIn, areaLocality, ageGroup, hobbies, page, perPage } = request.query as {
                interestedIn: string;
                areaLocality: string;
                ageGroup?: string;
                hobbies?: string[];
                page?: number;
                perPage?: number;
            };

            let filters: any = {
                areaLocality,
            }
            if (!isUser.verifiedUser) {
                filters.verifiedUser = false;
            }

            if (ageGroup) {
                const [minAgeStr, maxAgeStr] = ageGroup.split('-');
                const minAge = parseInt(minAgeStr);
                const maxAge = parseInt(maxAgeStr);

                const today = new Date();
                const minBirthDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
                const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

                filters.dateOfBirth = {
                    [Op.between]: [minBirthDate, maxBirthDate],
                };
            }
            if (interestedIn === 'women') {
                filters.gender = 'female';
            } else if (interestedIn === 'men') {
                filters.gender = 'male';
            }

            const blockedUserIds = isUser.blockedUsers || [];
            const likedUserIds = await LikeE.findLikedUserIdsByLikerId(isUser.id)
            const likedIds = likedUserIds.map((like: any) => like.likedUserId);

            filters.id = { [Op.notIn]: [...blockedUserIds, ...likedIds] };
            console.log(filters)
            let users = await UserE.findUsersBasedOnFilters(filters);

            if (hobbies) {
                const userHobbies = Array.isArray(hobbies) ? hobbies : [hobbies];
                users = users.filter((user: any) => {
                    const userHobbiesArr = user.hobbies || [];
                    return userHobbies.some(hobby => userHobbiesArr.includes(hobby));
                });
            }

            if (page && perPage) {
                const startIndex = (page - 1) * perPage;
                const endIndex = startIndex + perPage;
                users = users.slice(startIndex, endIndex);
            }
            await createApiLogger(request, stime);
            return h.response(users).code(200);

        } catch (error) {
            console.log('!!! Error searching users: ', error);
            return h.response({ status: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /******************* Block User API ****************/
    /***************************************************/
    static async blockUser(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);

            const isActive = await SessionE.ifSessionExists(isUser.id)
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            const blockedUserId = request.params.blockedUserId;
            await UserE.addToBlockUsersList(isUser.id, blockedUserId)

            return h.response({ status: '------- User blocked successfully -------' }).code(200);
        } catch (error) {
            console.log('!!! Error blocking user:', error);
            return h.response({ status: '!!! Error blocking user' }).code(500);
        }
    }


    /***************************************************/
    /*************** Remove Blocked User API ***********/
    /***************************************************/

    static async removeBlockedUser(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await UserE.ifEmailExists(user.email);

            const isActive = await SessionE.ifSessionExists(isUser.id)
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' });
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            const userIdToRemove = request.params.userId;

            const [rowsUpdated] = await UserE.removeFromBlockedUsersList(isUser.id, userIdToRemove);

            if (rowsUpdated === 0) {
                return h.response({ status: '!!! User not found or not in the blocked users list !!!' }).code(404);
            }

            return h.response({ status: '------- User unblocked successfully -------' }).code(200);
        } catch (error) {
            console.log('!!! Error unblocking user:', error);
            return h.response({ status: '!!! Error unblocking user' }).code(500);
        }
    }
}
