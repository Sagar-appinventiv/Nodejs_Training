import BaseEntity from "../entities/base.entity";
import { Notification } from '../models/notification.model'

class NotificationEntity extends BaseEntity {
    constructor() {
        super(Notification);
    }

    async createMatchNotification(likedUserId: number, userId: number, matchMessage: any) {
        let payload = {
            userId: likedUserId,
            senderId: userId,
            type: 'match',
            message: matchMessage,
        }

        return await this.create(payload);
    }

    async createLikeNotification(likedUserId: number, userId: number, notificationMessage: any) {
        let payload = {
            userId: likedUserId,
            senderId: userId,
            type: 'Like',
            message: notificationMessage,
        }

        return await this.create(payload);
    }

    async findNotification(id: number, userId: number) {
        let condition = { id: id, userId: userId };
        return await this.findOne(condition);
    }

    async readAllNotification(userId: number) {
        let payload = { isRead: true };
        let condition = { where: { userId: userId, isRead: false } }

        return await this.update(payload, condition);
    }
}

export const NotificationE = new NotificationEntity();