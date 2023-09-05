import { Request, ResponseToolkit } from '@hapi/hapi';
import { User } from '../models/user.model';
import { Op } from 'sequelize';
import { Session } from '../models/session.model';
import { sequelize } from '../database/dbConnection';


export class UserFeedController {
    /***************************************************/
    /****************** Search Users API ***************/
    /***************************************************/
    static async searchUsers(request: Request, h: ResponseToolkit) {
        try {
            const user: any = request.auth.credentials;
            const isUser = await User.findOne({ where: { email: user.email } });
            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            
            const { interestedIn, areaLocality, ageGroup, hobbies } = request.query as {
                interestedIn: string;
                areaLocality: string;
                ageGroup?: string;
                hobbies?: string[];
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
            filters.id = { [Op.notIn]: blockedUserIds };
            console.log(filters)
            let users = await User.findAll({
                where: filters,
                attributes: ['fullName', 'profilePicture', 'areaLocality', [sequelize.fn('DATE_PART', 'year', sequelize.fn('age', sequelize.col('dateOfBirth'))), 'age'], 'hobbies'
                ],
            });

            if (hobbies) {
                const userHobbies = Array.isArray(hobbies) ? hobbies : [hobbies];
                users = users.filter((user: any) => {
                    const userHobbiesArr = user.hobbies || [];
                    return userHobbies.some(hobby => userHobbiesArr.includes(hobby));
                });
            }
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
            const isUser = await User.findOne({ where: { email: user.email } });

            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' })
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            const blockedUserId = request.params.blockedUserId;
            await sequelize.query(
                `UPDATE "users" SET "blockedUsers" = array_append("blockedUsers", :blockedUserId) WHERE "id" = :userId`,
                {
                    replacements: { blockedUserId, userId: isUser.id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );

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
            const isUser = await User.findOne({ where: { email: user.email } });

            const isActive = await Session.findOne({ where: { userId: isUser.id } });
            if (!isActive.status) {
                return h.response({ status: '!!! User is inactive !!!' });
            }
            if (!isUser || !isUser.verifiedUser) {
                return h.response({ status: '!!! User is not verified !!!' }).code(403);
            }
            const userIdToRemove = request.params.userId;

            const userToRemove = await User.findByPk(userIdToRemove);

            if (!userToRemove) {
                return h.response({ status: '!!! User not found !!!' }).code(404);
            }

            await sequelize.query(
                `UPDATE "users" SET "blockedUsers" = array_remove("blockedUsers", :userIdToRemove) WHERE "id" = :userId`,
                {
                    replacements: { userIdToRemove, userId: isUser.id },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );

            return h.response({ status: '------- User unblocked successfully -------' }).code(200);
        } catch (error) {
            console.log('!!! Error unblocking user:', error);
            return h.response({ status: '!!! Error unblocking user' }).code(500);
        }
    }
}
