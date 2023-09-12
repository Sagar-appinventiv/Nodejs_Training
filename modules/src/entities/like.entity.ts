import BaseEntity from "../entities/base.entity";
import { Like } from '../models/like.model'

class LikeEntity extends BaseEntity {
    constructor() {
        super(Like);
    }

    async findLikedUserIdsByLikerId(userId: any) {
        let condition = { where: { likerId: userId }, attributes: ['likedUserId'] }
        return await this.findAllwithAttributes(condition)
    }

    async ifExistingLike(likerId: number, likedUserId: number) {
        let condition = { likerId: likerId, likedUserId: likedUserId };

        return await this.findOne(condition);
    }

    async createLike(likerId: number, likedUserId: number) {
        let payload = { likerId: likerId, likedUserId: likedUserId };
        return await this.create(payload);
    }

    async mutualLike(likerId: number, likedUserId: number ) {
        let condition = { likerId: likerId, likedUserId: likedUserId  };

        return await this.findOne(condition);
    }

    async deleteLike(likerId: number, likedUserId: number) {
        let condition = { likerId: likerId, likedUserId: likedUserId };
        const dataToDelete = await this.findOne(condition);

        return await this.destroy(dataToDelete);
    }
}

export const LikeE = new LikeEntity();