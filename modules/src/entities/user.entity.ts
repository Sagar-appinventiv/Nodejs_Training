import { Sequelize } from "sequelize";
import { sequelize } from "../database/dbConnection";
import BaseEntity from "../entities/base.entity";
import { User } from '../models/user.model'

class UserEntity extends BaseEntity {
    constructor() {
        super(User);
    }

    async findById(id: number) {
        let condition = { id: id };
        return await this.findOne(condition);
    }
    async ifEmailExists(email: string) {
        let condition = { email: email }
        let data = await this.findOne(condition)
        return data;
    }

    async createUser(payload:any) {
        // let payload = { fullName: name, email: email, password: password, mobileNo:mobileNo }
        let data = await this.create(payload)
        return data;
    }

    async findUsersBasedOnFilters(filters: any) {
        let condition = {
            where: filters, attributes: ['fullName', 'profilePicture', 'areaLocality', [sequelize.fn('DATE_PART', 'year', sequelize.fn('age', sequelize.col('dateOfBirth'))), 'age'], 'hobbies'],
        }
        return await this.findAllwithAttributes(condition)
    }

    async addToBlockUsersList(id: any, blockedUserId: any) {
        let payload = { blockedUsers: sequelize.fn('array_append', sequelize.col('blockedUsers'), blockedUserId) };
        let condition = { where: { id: id } };

        return await this.update(payload, condition);
    }

    async removeFromBlockedUsersList(id: number, userIdToRemove: number) {
        let payload = { blockedUsers: sequelize.fn('array_remove', sequelize.col('blockedUsers'), userIdToRemove) };
        let condition = { where: { id: id } };

        return await this.update(payload, condition);
    }

    async updateVerification(id: any) {
        let payload = { verifiedUser: true };
        let condition = { where: { id: id } };

        return await this.update(payload, condition);
    }

    async updateUserDetails(id: number, interestedIn: any, areaLocality: any, hobbies: any, mobileNo: any, dateOfBirth: any, gender: any, bio: any) {
        let payload = { interestedIn: interestedIn, areaLocality: areaLocality, hobbies: hobbies, mobileNo: mobileNo, dateOfBirth: dateOfBirth, gender: gender, bio: bio };
        let condition = { where: { id: id } };

        return await this.update(payload, condition);
    }

    async viewUserProfile(id: any,) {
        const condition = id
        const payload = {
            attributes: [
                'id',
                'fullName',
                'bio',
                'profilePicture',
                'galleryPhotos',
                'interestedIn',
                'gender',
                [Sequelize.fn('DATE_PART', 'year', Sequelize.fn('age', Sequelize.col('dateOfBirth'))), 'age'],
                'areaLocality',
                'hobbies',
                'verifiedUser'
            ],
        };
        return await this.findByPk(condition, payload)
    }

    async updatePassword(id: any, hashedPassword: any) {
        let payload = { password: hashedPassword };
        let condition = { where: { id: id } };

        return await this.update(payload, condition)
    }

    async updateProfilePicture(id: any, name: any) {
        let payload = { profilePicture: name };
        let condition = { where: { id: id } };

        return await this.update(payload, condition)

    }

    async updateGallery(id: any, name: any) {
        let payload = { galleryPhotos: name };
        let condition = { where: { id: id } };

        return await this.update(payload, condition)
    }
    
}

export const UserE = new UserEntity();

