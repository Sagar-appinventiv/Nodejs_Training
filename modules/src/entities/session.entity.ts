import BaseEntity from "../entities/base.entity";
import { Session } from '../models/session.model'

class SessionEntity extends BaseEntity {
    constructor() {
        super(Session);
    }

    async ifSessionExists(id: any) {
        let condition = { userId: id }
        let data = await this.findOne(condition)
        return data;
    }

    async DeleteSession(id: number) {
        const Condition = { userId: id };
        const dataToDelete = await this.findOne(Condition);
        return await this.destroy(dataToDelete);
    }
}
export const SessionE = new SessionEntity();
