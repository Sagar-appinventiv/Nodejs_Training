import { Request, ResponseToolkit } from '@hapi/hapi';
import { User } from '../models/user.model';
import { Op } from 'sequelize';
import { Session } from '../models/session.model';

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

            let users = await User.findAll({
                where: filters,
            });

            if (hobbies) {
                const userHobbies = Array.isArray(hobbies) ? hobbies : [hobbies];
                users = users.filter((user:any) => {
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
    /****************** Search Users API ***************/
    /***************************************************/
}
