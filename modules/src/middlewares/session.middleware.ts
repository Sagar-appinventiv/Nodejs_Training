import { Session } from "../models/session.model";
import { Redis } from "../middlewares/redis.middleware";

export class Sessions {
    static async maintain_session(isUser:any) {
        try {
            const user = isUser.id;
            const isSession: any = await Session.findOne({ where: { userId: user } })

            if (!isSession) {
                const session_details = {
                    userId: user,
                    status: true
                };
                const session = await Session.create(session_details);
                console.log("------- Session stored successfully : ", session);
            }
            else {
                if (!isSession.status) {
                    await Session.update({ status: !isSession.status }, { where: { userId: user } });
                    console.log("------- Session Activated -------");
                }
                else {
                    console.log("!!! Session is already Active !!!");
                }
            }
            await Redis.maintain_redisSession(isUser);
        }
        catch (error) {
            console.log("!!! Server Error : ", error)
        }
    }

    static async update_session(user_id: any) {
        const isSession: any = await Session.findOne({ where: { userId: user_id } })
        if (isSession) {
            if (isSession.status) {
                await Session.update({ status: !isSession.status }, { where: { userId: user_id } });
                return true;
            }
            else {
                console.log("!!! User is already inactive !!!")
                return false;
            }
        }
        else {
            return false;
        }
    }
}